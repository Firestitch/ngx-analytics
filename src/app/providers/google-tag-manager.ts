import { Provider } from "./provider";

import { BehaviorSubject, from, interval } from "rxjs";
import { filter, switchMap, take, takeWhile } from "rxjs/operators";
import { EventType } from "../enums";
import { AddToCartEvent, AppPaymentEvent, BeginCheckoutEvent, Item, PurchaseEvent, RemoveFromCartEvent } from "../interfaces";


export class GoogleTagManagerProvider extends Provider {

  private _initData = [];
  private _init$ = new BehaviorSubject<boolean>(false);

  public init() {
    if (this.containerId) {
      const scriptDomain = this.scriptDomain || 'www.googletagmanager.com';
      from(this.addScript(`https://${scriptDomain}/gtm.js?id=${this.containerId}`))
        .pipe(
          switchMap(() => interval(100)),
          take(1000),
          takeWhile(() => !this._init$.getValue()),
          filter(() => {
            return this.window.dataLayer.some((item) => item.event === 'gtm.load');
          })
        )
        .subscribe(() => {
          this._init$.next(true);
          this._init$.complete();
          this._initData.forEach((data) => {
            this.window.dataLayer.push(data);
          });
        });

      this.window.dataLayer = this.window.dataLayer || [];
      this.window.dataLayer.push({
        event: 'gtm.js',
        'gtm.start': new Date().getTime(),
      });

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
    const mapping = this._getMapping(type);
    const data = mapping.transform ?
      mapping.transform(mapping.type, value) : {
        event: type,
        value,
        category: options?.category,
        label: options?.label,
      } as any;

    const dataLayer = this._init$.getValue() ?
      this.window.dataLayer :
      this._initData;

    if (mapping.ecommerce) {
      dataLayer.push({ ecommerce: null });
    }

    dataLayer.push(data);
  }

  public setUser(data) { }

  public get containerId() {
    return this._config.providers.googleTagManager?.containerId;
  }

  public get scriptDomain() {
    return this._config.providers.googleTagManager?.scriptDomain;
  }

  private _mapPurchaseEventData(event: string, value: PurchaseEvent) {
    return {
      event,
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

  private _mapBeginCheckoutEventData(event: string, value: BeginCheckoutEvent) {
    return {
      event,
      ecommerce: {
        value: value.total,
        currency: value.currency,
        items: this._mapItems(value.items),
      }
    }
  }

  private _mapAddToCartEventData(event: string, value: AddToCartEvent) {
    return {
      event,
      ecommerce: {
        value: value.total,
        currency: value.currency,
        items: this._mapItems(value.items),
      }
    }
  }

  private _mapRemoveFromCartEventData(event: string, value: RemoveFromCartEvent) {
    return {
      event,
      ecommerce: {
        value: value.total,
        currency: value.currency,
        items: this._mapItems(value.items),
      }
    }
  }

  private _mapAddPaymentEventData(event: string, value: AppPaymentEvent) {
    return {
      event,
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
        price: item.price || 0,
        quantity: item.quantity || 1,
        item_category: item.category,
        item_category2: item.category2,
      }));
  }

  private _getMapping(type: EventType | string): { type: string, transform: (event: string, value: any) => any, ecommerce: boolean } {
    let transform: (event: string, value: any) => any;
    if (type === EventType.Purcahse) {
      type = 'purchase';
      transform = (event: string, value: any) => this._mapPurchaseEventData(event, value);
    } else if (type === EventType.BeginCheckout) {
      type = 'begin_checkout';
      transform = (event: string, value: any) => this._mapBeginCheckoutEventData(event, value);
    } else if (type === EventType.AddPayment) {
      type = 'add_payment_info';
      transform = (event: string, value: any) => this._mapAddPaymentEventData(event, value);
    } else if (type === EventType.AddToCart) {
      type = 'add_to_cart';
      transform = (event: string, value: any) => this._mapAddToCartEventData(event, value);
    } else if (type === EventType.RemoveFromCart) {
      type = 'remove_from_cart';
      transform = (event: string, value: any) => this._mapRemoveFromCartEventData(event, value);
    }

    return { type, transform, ecommerce: !!transform };
  }
}