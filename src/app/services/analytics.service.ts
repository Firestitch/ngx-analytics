import { Injectable, Injector, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { EventType } from '../enums';
import { FS_ANALYTICS_CONFIG } from '../injectors';
import { AddToCartEvent, AnalyticsProcessor, AppPaymentEvent, BeginCheckoutEvent, CustomProviderConfig, FsAnalyticsConfig, ProviderActivity, ProviderConfig, PurchaseEvent, RemoveFromCartEvent } from '../interfaces';
import { CustomProvider, FacebookPixelProvider, GoogleAnalyticsProvider, GoogleTagManagerProvider, KlaviyoProvider } from '../providers';
import { Provider } from '../providers/provider';

import { AnalyticsProcessorService } from './analytics-processor.service';


@Injectable({
  providedIn: 'root',
})
export class FsAnalytics {

  private _config = inject<FsAnalyticsConfig>(FS_ANALYTICS_CONFIG);
  private _injector = inject(Injector);
  private _router = inject(Router);

  private _providers: Provider[] = [];
  private _processorService: AnalyticsProcessor;
  private _initialized = false;
  private _activity = new Subject<ProviderActivity>();

  // Introspection stream: emits what the analytics stack is doing (app calls,
  // per-provider receipts, and provider init/destroy). Intended for tooling and
  // debugging (e.g. the playground's live log) — normal apps can ignore it.
  public get activity$(): Observable<ProviderActivity> {
    return this._activity.asObservable();
  }

  // The providers currently registered and running, in registration order.
  public getProviders(): { name: string }[] {
    return this._providers.map((provider) => ({ name: provider.name }));
  }

  // Whether a provider with this name is currently registered/active.
  public hasProvider(name: string): boolean {
    return this._providers.some((provider) => provider.name === name);
  }

  public init() {
    // Guard against double-init (e.g. init() called again on a hot reload or a
    // second bootstrap) which would otherwise register every provider twice.
    if (this._initialized) {
      return;
    }
    this._initialized = true;

    this._initProcessor();

    (this._config.providers || []).forEach((providerConfig) => {
      const provider = this._createProvider(providerConfig);
      if (provider) {
        this._providers.push(provider);
      }
    });

    this._providers.forEach((provider) => {
      provider.init();
      this._emit({ provider: provider.name, kind: 'init', action: 'init' });
    });
  }


  // Register + init a single provider of ANY type at runtime — used to activate
  // a provider only on certain routes (e.g. Google Analytics on the checkout
  // pages but not app-wide) while the providers in the config stay up for the
  // life of the app. Safe to call before init(): the processor is created on
  // first use. No-op if a provider with this name already exists — built-in
  // providers are named by their type ('googleAnalytics', 'klaviyo', ...),
  // custom ones by their `name`.
  public addProvider(config: ProviderConfig) {
    this._initProcessor();

    const provider = this._createProvider(config);
    if (!provider || this._providers.some((existing) => existing.name === provider.name)) {
      return;
    }

    this._providers.push(provider);
    provider.init();
    this._emit({ provider: provider.name, kind: 'init', action: 'init' });
  }

  // Register + init a single custom provider at runtime. Kept for callers that
  // predate addProvider(); the two are the same operation.
  public addCustomProvider(custom: CustomProviderConfig) {
    this.addProvider(custom);
  }

  // Tear down and unregister a single provider by name (leaves the others
  // running). Pairs with addCustomProvider for route-scoped providers.
  public destroyProvider(name: string) {
    const index = this._providers.findIndex((provider) => provider.name === name);
    if (index === -1) {
      return;
    }

    this._providers[index].destroy();
    this._providers.splice(index, 1);
    this._emit({ provider: name, kind: 'destroy', action: 'destroy' });
  }

  // Tear down every provider and reset — the whole analytics stack goes quiet.
  public destroy() {
    this._providers.forEach((provider) => {
      provider.destroy();
      this._emit({ provider: provider.name, kind: 'destroy', action: 'destroy' });
    });
    this._providers = [];
    this._initialized = false;
  }

  public addToCart(data: AddToCartEvent) {
    this.trackEvent(EventType.AddToCart, data);
  }

  public addPayment(data: AppPaymentEvent) {
    this.trackEvent(EventType.AddPayment, data);
  }

  public removeFromCart(data: RemoveFromCartEvent) {
    this.trackEvent(EventType.RemoveFromCart, data);
  }

  public beginCheckout(event: BeginCheckoutEvent) {
    event = {
      ...event,
      total: event.total || 0,
      items: (event.items || [])
        .map((product) => ({
          ...product,
          price: product.price || 0,
          quantity: product.quantity || 1,
        })),
    };

    this.trackEvent(EventType.BeginCheckout, event);
  }

  public purchase(event: PurchaseEvent) {
    event = {
      ...event,
      total: event.total || 0,
      shipping: event.shipping || 0,
      tax: event.tax || 0,
      items: (event.items || [])
        .map((product) => ({
          ...product,
          price: product.price || 0,
          quantity: product.quantity || 1,
        })),
    };

    this.trackEvent(EventType.Purcahse, event);
  }

  public trackEvent(type: string, data?: any) {
    this._emit({ provider: null, kind: 'app', action: type, data });

    this._processorService.process({ type, data })
      .pipe(
        take(1),
      )
      .subscribe(() => {
        this._providers
          .forEach((provider) => {
            provider.trackEvent(type, data);
            this._emit({ provider: provider.name, kind: 'received', action: type, data });
          });
      });
  }

  public setUser(data) {
    this._emit({ provider: null, kind: 'app', action: 'setUser', data });

    this._providers.forEach((provider) => {
      provider.setUser(data);
      this._emit({ provider: provider.name, kind: 'received', action: 'setUser', data });
    });
  }
  
  // Instantiate the right provider class for a config entry, keyed on `type`.
  private _createProvider(config: ProviderConfig): Provider | null {
    switch (config.type) {
      case 'googleAnalytics':
        return new GoogleAnalyticsProvider(this._injector, this._config, this._router, config);
      case 'googleTagManager':
        return new GoogleTagManagerProvider(this._injector, this._config, this._router, config);
      case 'facebookPixel':
        return new FacebookPixelProvider(this._injector, this._config, this._router, config);
      case 'klaviyo':
        return new KlaviyoProvider(this._injector, this._config, this._router, config);
      case 'custom':
        return new CustomProvider(this._injector, this._config, this._router, config);
      default:
        return null;
    }
  }

  // The processor is shared by every provider and is needed before the first
  // trackEvent(), whether that provider came from the config or addProvider().
  private _initProcessor() {
    if (!this._processorService) {
      this._processorService = this._config.processor || new AnalyticsProcessorService();
    }
  }

  private _emit(activity: ProviderActivity) {
    this._activity.next(activity);
  }
}
