import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { take } from 'rxjs/operators';
import { EventType } from '../enums';
import { FS_ANALYTICS_CONFIG } from '../injectors';
import { AnalyticsProcessor, FsAnalyticsConfig, PurchaseEvent } from '../interfaces';
import { FacebookPixelProvider, GoogleAnalyticsProvider, GoogleTagsProvider, KlaviyoProvider } from '../providers';
import { Provider } from '../providers/provider';
import { AnalyticsProcessorService } from './analytics-processor.service';


@Injectable({
  providedIn: 'root',
})
export class FsAnalytics {

  private _providers: Provider[] = [];
  private _processorService: AnalyticsProcessor;

  public constructor(
    @Inject(FS_ANALYTICS_CONFIG) private _config: FsAnalyticsConfig,
    private _injector: Injector,
    private _router: Router,
  ) { }

  public init() {
    this._processorService = this._config.processor || new AnalyticsProcessorService();

    if (this._config.providers.googleAnalytics) {
      this._providers.push(new GoogleAnalyticsProvider(this._injector, this._config, this._router));
    }

    if (this._config.providers.googleTags) {
      this._providers.push(new GoogleTagsProvider(this._injector, this._config, this._router));
    }

    if (this._config.providers.facebookPixel) {
      this._providers.push(new FacebookPixelProvider(this._injector, this._config, this._router));
    }

    if (this._config.providers.klaviyo) {
      this._providers.push(new KlaviyoProvider(this._injector, this._config, this._router));
    }

    this._providers.forEach((provider) => {
      provider.init();
    });
  }

  public purchase(event: PurchaseEvent) {
    event = {
      ...event,
      total: event.total || 0,
      shipping: event.shipping || 0,
      tax: event.tax || 0,
      products: (event.products || [])
        .map((product) => ({
          ...product,
          price: product.price || 0,
          quantity: product.quantity || 1,
        }))
    };

    this.trackEvent(EventType.Purcahse, event);
  }

  public trackEvent(type: string, data?: any) {
    this._processorService.process({ type, data })
      .pipe(
        take(1),
      )
      .subscribe(() => {
        this._providers
          .forEach((provider) => {
            provider.trackEvent(type, data);
          });
      });
  }

  public setUser(data) {
    this._providers.forEach((provider) => {
      provider.setUser(data);
    });
  }
}
