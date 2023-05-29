import { Provider } from "./provider";

import { filter, skip } from 'rxjs/operators';
import { NavigationEnd } from "@angular/router";

declare let gtag: Function;


export class GoogleTagsProvider extends Provider {

  public init() {
    if(this.containerId) {
      this.addScript(`https://www.googletagmanager.com/gtm.js?id=${this.containerId}`);

      this.window.dataLayer = this.window.dataLayer || [];
      this.window.gtag = function (event, action, options) {
        if(event==='event') {
        const payload = {
          'event': action,
          ...options
        };
        (window as any).dataLayer.push(payload);
      } else {
        (window as any).dataLayer.push(arguments);
      }
      }

      gtag('js', new Date());
      gtag('config', this.containerId, { path_path: this._router.url });
    }
  }

  public trackPage(path: string): void {
    gtag('event', 'page_view', {
      page_path: path,
      send_to: this.containerId
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

  public setUser(data) {

  }

  public get containerId() {
    return this._config.googleTags?.containerId;
  }
}