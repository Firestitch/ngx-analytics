import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { FS_ANALYTICS_CONFIG } from '../injectors';
import { FsAnalyticsConfig } from '../interfaces';
import { Provider } from '../providers/provider';
import { FacebookPixelProvider, GoogleAnalyticsProvider, GoogleTagsProvider, KlaviyoProvider } from '../providers';


@Injectable({
  providedIn: 'root',
})
export class FsAnalytics {

  private _providers: Provider[] = [];

  public constructor(
    @Inject(FS_ANALYTICS_CONFIG) private _config: FsAnalyticsConfig,
    private _injector: Injector,
    private _router: Router,
  ) {}

  public init() {
    if (this._config.googleAnalytics) {
      this._providers.push(new GoogleAnalyticsProvider(this._injector, this._config, this._router));
    }

    if (this._config.googleTags) {
      this._providers.push(new GoogleTagsProvider(this._injector, this._config, this._router));
    }

    if (this._config.facebookPixel) {
      this._providers.push(new FacebookPixelProvider(this._injector, this._config, this._router));
    }

    if (this._config.klaviyo) {
      this._providers.push(new KlaviyoProvider(this._injector, this._config, this._router));
    }

    this._providers.forEach((provider) => {
      provider.init();
    });
  }

  public trackEvent(action: string, data?: any) {
    this._providers.forEach((provider) => {
      provider.trackEvent(action, data);
    });
  }

  public setUser(data) {
    this._providers.forEach((provider) => {
      provider.setUser(data);
    });
  }
}
