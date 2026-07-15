import { EventType } from "../enums";
import { GoogleAnalyticsProviderConfig, PurchaseEvent } from "../interfaces";
import { Provider } from "./provider";

declare let gtag: Function;


export class GoogleAnalyticsProvider extends Provider {

  public readonly name = 'googleAnalytics';

  public init() {
    if (this.measurementId) {
      this.addScript(`https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`);

      this.window.dataLayer = this.window.dataLayer || [];
      this.window.gtag = function () {
        (window as any).dataLayer.push(arguments);
      }

      gtag('js', new Date());
      gtag('config', this.measurementId, { page_path: this._router.url });
    }
  }

  public destroy(): void {
    // Removes the router subscription and the injected gtag <script> node.
    super.destroy();

    if (this.measurementId) {
      // GA4's documented opt-out: once this flag is set, gtag.js suppresses all
      // hits for this measurement id — including its own auto/enhanced-measurement
      // tracking that runs independently of this library. Survives on window so it
      // stays in effect even though the provider instance is gone.
      this.window[`ga-disable-${this.measurementId}`] = true;
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
    if (!this.measurementId) {
      return;
    }

    this.gtag('set', 'user_properties', data);

    if (data?.id) {
      this.gtag('config', this.measurementId, { user_id: data.id });
    }
  }

  public get measurementId() {
    return (this._providerConfig as GoogleAnalyticsProviderConfig)?.measurementId;
  }
}