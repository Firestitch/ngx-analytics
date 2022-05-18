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

  public addScript(src, onload = null) {
    var script = document.createElement('script');    
    script.src = src;
    script.setAttribute('async','');

    if(onload) {
      script.onload = () => {
        onload();
      };
    }

    this.appendHead(script);
  }

  public appendHead(el) {
    document.getElementsByTagName('head')[0].appendChild(el);
  }
}