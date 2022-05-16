import { Inject, Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { GoogleAnalyticsProvider } from "../providers/google-analytics";
import { FS_ANALYTICS_CONFIG } from "../injectors";
import { FsAnalyticsConfig } from "../interfaces";
import { Angulartics2 } from 'angulartics2';
import { Provider } from '../providers/provider';


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
    if(this._config.googleAnalytics) {
      this._providers.push(new GoogleAnalyticsProvider(this._injector, this._config, this._router));
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
}