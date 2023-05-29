import { Provider } from "./provider";

declare let gtag: Function;


export class GoogleAnalyticsProvider extends Provider {

  public init() {
    if(this.measurementId) {
      this.addScript(`https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`);

      this.window.dataLayer = this.window.dataLayer || [];
      this.window.gtag = function () {
        (window as any).dataLayer.push(arguments);
      }

      gtag('js', new Date());
      gtag('config', this.measurementId, { path_path: this._router.url });
    }
  }

  public trackPage(path: string): void {
    gtag('event', 'page_view', {
      page_path: path,
      send_to: this.measurementId
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

  public get measurementId() {
    return this._config.googleAnalytics?.measurementId;
  }
}