import { Injector } from "@angular/core";
import { Router } from "@angular/router";

import { FsAnalyticsConfig } from "../interfaces/analytics-config";


export abstract class Provider {

  public abstract init(): void;
  public abstract trackEvent(action, value?, catgegory?, label?): void;

  public constructor(
    protected _injector: Injector,
    protected _config: FsAnalyticsConfig,
    protected _router: Router,
  ) {}

  public get window() {
    return (window as any);
  }

  public getAngulartics2Provider() {
    
  }
}