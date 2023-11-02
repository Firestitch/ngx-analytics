import { Provider } from "./provider";

import { EventType } from "../enums";
import { AddToCartEvent, AppPaymentEvent, BeginCheckoutEvent, Item, PurchaseEvent, RemoveFromCartEvent } from "../interfaces";


export class GoogleTagManagerProvider extends Provider {

  public init() {
    if (this.containerId) {
      const scriptDomain = this.scriptDomain || 'www.googletagmanager.com';
      this.addScript(`https://${scriptDomain}/gtm.js?id=${this.containerId}`);
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
    const data = this._mapEventData(type, value, options);
    const event = this._mapTypeEvent(type);

    this.window.dataLayer.push({ ecommerce: null });
    this.window.dataLayer.push({
      event,
      ...data
    });
  }

  public setUser(data) { }

  public get containerId() {
    return this._config.providers.googleTagManager?.containerId;
  }

  public get scriptDomain() {
    return this._config.providers.googleTagManager?.scriptDomain;
  }

  private _mapPurchaseEventData(value: PurchaseEvent) {
    return {
      ecommerce: {
        transaction_id: value.transactionId,
        value: value.total,
        tax: value.tax,
        shipping: value.shipping,
        currency: value.currency,
        items: this._mapItems(value.items),
      }
    }
  }

  private _mapBeginCheckoutEventData(value: BeginCheckoutEvent) {
    return {
      ecommerce: {
        value: value.total,
        currency: value.currency,
        items: this._mapItems(value.items),
      }
    }
  }

  private _mapAddToCartEventData(value: AddToCartEvent) {
    return {
      ecommerce: {
        value: value.total,
        currency: value.currency,
        items: this._mapItems(value.items),
      }
    }
  }

  private _mapRemoveFromCartEventData(value: RemoveFromCartEvent) {
    return {
      ecommerce: {
        value: value.total,
        currency: value.currency,
        items: this._mapItems(value.items),
      }
    }
  }

  private _mapAddPaymentEventData(value: AppPaymentEvent) {
    return {
      ecommerce: {
        value: value.total,
        currency: value.currency,
        payment_type: value.paymentType,
        items: this._mapItems(value.items),
      }
    }
  }

  private _mapItems(items: Item[]) {
    return items
      .map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        item_category: item.category,
        item_category2: item.category2,
      }));
  }

  private _mapTypeEvent(type: EventType) {
    if (type === EventType.Purcahse) {
      return 'purchase';
    } else if (type === EventType.BeginCheckout) {
      return 'begin_checkout';
    } else if (type === EventType.AddPayment) {
      return 'add_payment_info';
    } else if (type === EventType.AddToCart) {
      return 'add_to_cart';
    } else if (type === EventType.RemoveFromCart) {
      return 'remove_from_cart';
    }

    return type;
  }

  private _mapEventData(type: EventType, value, options) {
    if (type === EventType.Purcahse) {
      return this._mapPurchaseEventData(value);
    } else if (type === EventType.BeginCheckout) {
      return this._mapBeginCheckoutEventData(value);
    } else if (type === EventType.AddPayment) {
      return this._mapAddPaymentEventData(value);
    } else if (type === EventType.AddToCart) {
      return this._mapAddToCartEventData(value);
    } else if (type === EventType.RemoveFromCart) {
      return this._mapRemoveFromCartEventData(value);
    }

    return {
      value,
      category: options?.category,
      label: options?.label,
    } as any;
  }
}