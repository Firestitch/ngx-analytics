import { Provider } from "./provider";

import { EventType } from "../enums";
import { PurchaseEvent } from "../interfaces";


export class GoogleTagsProvider extends Provider {

  public init() {
    if (this.containerId) {
      this.addScript(`https://www.googletagmanager.com/gtm.js?id=${this.containerId}`);
      this.window.dataLayer = this.window.dataLayer || [];

      this.pushData('js', new Date());
      this.pushData('config', this.containerId, { path_path: this._router.url });
    }
  }

  public pushData(...data: any): void {
    this.window.dataLayer.push(data);
  }

  public trackPage(path: string): void {
    this.trackEvent('pageview', {
      page: {
        path,
      }
    });
  }

  public trackEvent(type: any, value?, options?): void {
    let data = {
      value,
      category: options?.category,
      label: options?.label,
    } as any;

    if (type === EventType.Purcahse) {
      const purchaseEvent: PurchaseEvent = value;
      data = {
        ecommerce: {
          transaction_id: purchaseEvent.transactionId,
          value: purchaseEvent.total,
          tax: purchaseEvent.tax,
          shipping: purchaseEvent.shipping,
          currency: purchaseEvent.currency,
          items: purchaseEvent.products
            .map((product) => ({
              item_id: product.id,
              item_name: product.name,
              price: product.price,
              quantity: product.quantity,
              item_category: product.category,
              item_category2: product.category2,
            })),
        }
      }
    }

    this.window.dataLayer.push({
      event: type,
      ...data
    });
  }

  public setUser(data) { }

  public get containerId() {
    return this._config.providers.googleTags?.containerId;
  }
}