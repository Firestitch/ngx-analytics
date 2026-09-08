import { EventType } from "../enums";
import { GoogleAnalyticsProviderConfig, PurchaseEvent } from "../interfaces";
import { Provider } from "./provider";

declare let gtag: Function;


export class GoogleAnalyticsProvider extends Provider {

  public readonly name = 'googleAnalytics';

  public init() {
    if (this.measurementId) {
      // Clear the opt-out destroy() sets. It lives on window and outlives the
      // provider instance, so without this a destroy()/init() cycle — a provider
      // scoped to certain routes, re-entered — would come back permanently mute.
      this.window[`ga-disable-${this.measurementId}`] = false;

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

  // Google is told the id and NOTHING else.
  //
  // `FsAnalytics.setUser()` hands the SAME object to every registered provider, so
  // whatever a caller includes for another provider's benefit — an email for
  // Klaviyo's merge key, a name — arrives here too. This used to write that whole
  // object into GA4 user properties, which is how patient email addresses and
  // names reached Google from an app that was only trying to identify a Klaviyo
  // profile. Ignore every other field: user properties are for attributes, and
  // Google's terms prohibit sending anything that could identify a person.
  //
  // `user_id` is GA4's purpose-built field for exactly this, and an opaque
  // application key is what belongs in it. If non-identifying user properties are
  // ever wanted, they must arrive as an explicit, named opt-in — never by default.
  public setUser(data) {
    if (!this.measurementId) {
      return;
    }

    if (data?.id) {
      this.gtag('config', this.measurementId, { user_id: data.id });
    }
  }

  public get measurementId() {
    return (this._providerConfig as GoogleAnalyticsProviderConfig)?.measurementId;
  }
}