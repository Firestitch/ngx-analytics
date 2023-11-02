import { EventType } from "../enums";
import { PurchaseEvent } from "../interfaces";
import { Provider } from "./provider";

declare let gtag: Function;


export class GoogleAnalyticsProvider extends Provider {

  public init() {
    if (this.measurementId) {
      this.addScript(`https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`);

      this.window.dataLayer = this.window.dataLayer || [];
      this.window.gtag = function () {
        (window as any).dataLayer.push(arguments);
      }

      gtag('js', new Date());
      gtag('config', this.measurementId, { path_path: this._router.url });
    }
  }

  public trackEvent(type: EventType | string, value?, options?): void {
    let data = {
      event_category: options?.category,
      event_label: options?.label,
      value: value
    } as any;

    if (type === EventType.Purcahse) {
      const prucahseEvent = value as PurchaseEvent;
      data = {
        transaction_id: prucahseEvent.transactionId,
        value: prucahseEvent.total,
        tax: prucahseEvent.tax,
        shipping: prucahseEvent.shipping,
        currency: prucahseEvent.currency,
        items: prucahseEvent.items
          .map((product) => ({
            item_id: product.id,
            item_name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
          }))
      };
    }

    this.gtag('event', type, data);
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

  public setUser(data) {

  }

  public get measurementId() {
    return this._config.providers.googleAnalytics?.measurementId;
  }
}