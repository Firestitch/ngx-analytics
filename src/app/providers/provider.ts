import { Injector } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, skip } from 'rxjs/operators';

import { FsAnalyticsConfig, ProviderConfig } from '../interfaces/analytics-config';


export abstract class Provider {

  // Identifies the provider so it can be torn down individually via
  // FsAnalytics.destroyProvider(name). Built-in providers set a stable name;
  // custom providers take theirs from config.
  public abstract readonly name: string;

  // Held so destroy() can unsubscribe. Previously this subscription was created
  // and never released, leaking one router subscription per provider for the
  // life of the app.
  private _routerSubscription: Subscription;

  // Every DOM node this provider appended (scripts, tracking pixels). destroy()
  // removes them so a torn-down provider leaves no tags behind. Note: removing a
  // <script> node does NOT unload the code it already ran — globals the vendor
  // SDK defined stay in memory. That's why each built-in destroy() also neutralizes
  // the SDK via its documented opt-out (see subclasses).
  private _injectedNodes: Node[] = [];

  // `_providerConfig` is this provider's own entry from the providers array
  // (e.g. { type: 'klaviyo', publicApiKey: '...' }). `_config` remains the whole
  // FsAnalyticsConfig for anything that needs it.
  constructor(
    protected _injector: Injector,
    protected _config: FsAnalyticsConfig,
    protected _router: Router,
    protected _providerConfig?: ProviderConfig,
  ) {
    this._routerSubscription = this._router.events.pipe(
      skip(1),
      filter((event) => event instanceof NavigationEnd),
    )
      .subscribe((event: NavigationEnd) => {
        this.trackPage(event.urlAfterRedirects);
      });
  }

  public abstract init(): void;
  public abstract trackEvent(type: string, value?, catgegory?, label?): void;
  public abstract trackPage(path): void;
  public abstract setUser(data: {
    name?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    id?: string,
  }): void;

  public get window() {
    return (window as any);
  }

  // Tear the provider down: stop tracking page views, remove every DOM node this
  // provider injected, and release resources. Subclasses that also define vendor
  // globals should override, call super.destroy(), then neutralize the SDK via its
  // documented opt-out (removing the <script> node alone does not undo code that
  // already ran).
  public destroy(): void {
    this._routerSubscription?.unsubscribe();

    this._injectedNodes.forEach((node) => {
      node.parentNode?.removeChild(node);
    });
    this._injectedNodes = [];
  }

  public addScript(src): Promise<void> {
    return new Promise((resolve, error) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('async', 'true');
      script.onload = () => {
        resolve();
      };

      script.onerror = () => {
        error();
      };

      this.appendHead(script);
    });
  }

  public appendHead(el) {
    // Record the node so destroy() can remove it later.
    this._injectedNodes.push(el);
    document.getElementsByTagName('head')[0].appendChild(el);
  }
}
