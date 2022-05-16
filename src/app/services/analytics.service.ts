import { Inject, Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { GoogleAnalyticsProvider } from "../../providers/google-analytics";
import { FS_ANALYTICS_CONFIG } from "../injectors";
import { FsAnalyticsConfig } from "../interfaces";
import { Angulartics2 } from 'angulartics2';


@Injectable({
  providedIn: 'root',
})
export class FsAnalytics {

  public constructor(
    @Inject(FS_ANALYTICS_CONFIG) private _config: FsAnalyticsConfig,
    private _injector: Injector,
    private _router: Router,
    private _angulartics2: Angulartics2,
  ) {}

  public init() {
    if(this._config.googleAnalytics) {
      (new GoogleAnalyticsProvider(this._injector, this._config, this._router))
        .init();
    }
  }

  public trackEvent(action: string, data?: any) {
    this._angulartics2.eventTrack.next({ action, properties: data, });
  }
}