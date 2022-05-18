import { Provider } from "./provider";

import { filter, skip } from 'rxjs/operators';
import { NavigationEnd } from "@angular/router";

declare let gtag: Function;


export class GoogleAnalyticsProvider extends Provider {

  public init() {
    if(this.trackingId) {
      this.addScript(`https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`);
   
      this.window.dataLayer = this.window.dataLayer || [];
      this.window.gtag = function () {
        (window as any).dataLayer.push(arguments); 
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