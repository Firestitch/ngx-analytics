import { Injector } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import { filter, skip } from "rxjs/operators";
import { FsAnalyticsConfig } from "../interfaces/analytics-config";


export abstract class Provider {

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

  public constructor(
    protected _injector: Injector,
    protected _config: FsAnalyticsConfig,
    protected _router: Router,
  ) {
    this._router.events.pipe(
      skip(1),
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe((event: NavigationEnd) => {
        this.trackPage(event.urlAfterRedirects);
      });
  }

  public get window() {
    return (window as any);
  }

  public addScript(src): Promise<void> {
    return new Promise((resolve, error) => {
      var script = document.createElement('script');
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
    document.getElementsByTagName('head')[0].appendChild(el);
  }
}