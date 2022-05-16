import { Provider } from "./provider";

import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { filter, skip } from "rxjs";
import { NavigationEnd } from "@angular/router";

declare let gtag: Function;

export class GoogleAnalyticsProvider extends Provider {

  public init() {
    var script = document.createElement('script');    
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    script.setAttribute('async','');
    document.getElementsByTagName('head')[0].appendChild(script);

    this.window.dataLayer = this.window.dataLayer || [];
    this.window.gtag = function () {
      (window as any).dataLayer.push(arguments); 
      console.log((window as any).dataLayer);
    }  

    gtag('js', new Date());
    gtag('config', this.trackingId, { path_path: this._router.url });
    
    this._router.events.pipe(
      skip(1),
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe((event: NavigationEnd) => {
      gtag('event', 'page_view', {
        page_path: event.urlAfterRedirects,
        send_to: this.trackingId
      })
    });
  }

  public gtag(name, value, options = {}) {
    this.window.gtag(name, value, options);
  }

  public trackEvent(action: any, value?, options?): void {
    this.gtag('event', action, {
      'event_category': options?.category,
      'event_label': options?.label,
      'value': value
    });
  }
  
  public get trackingId() {
    return this._config.googleAnalytics?.measurementId;
  }
}