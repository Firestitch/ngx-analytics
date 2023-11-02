import { EventType } from "../enums";
import { PurchaseEvent } from "../interfaces";
import { Provider } from "./provider";


declare let fbq: Function;


export class FacebookPixelProvider extends Provider {

  public init() {
    this.addScript();
    this.addImg();
  }

  public trackEvent(type: string | EventType, value?, options?): void {
    let data = {
      ...options,
      value,
    };

    if (type === EventType.Purcahse) {
      const prucahseEvent = value as PurchaseEvent;
      type = 'Purchase';
      data = {
        currency: prucahseEvent.currency,
        value: prucahseEvent.total,
        contents: prucahseEvent.items
          .map((product) => ({
            id: product.id,
            quantity: product.quantity || 1,
          }))
      };
    }

    fbq('track', type, data);
  }

  public addScript(): Promise<void> {
    const f = window as any;
    const n: any = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };

    if (!f._fbq) {
      f._fbq = n;
    }

    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];

    return new Promise((resolve, error) => {
      super.addScript(`https://connect.facebook.net/en_US/fbevents.js`)
        .then(() => {
          fbq('init', this.pixelId);
          this.trackEvent('PageView');
          resolve();
        })
        .catch(error);
    });
  }

  public trackPage(path: string): void {
    this.trackEvent('PageView', { path });
  }

  public setUser(data) {

  }

  public addImg(): void {
    var img = document.createElement('img');
    img.setAttribute('height', '1');
    img.setAttribute('width', '1');
    img.setAttribute('style', 'display:none');
    img.setAttribute('src', `https://www.facebook.com/tr?id=${this.pixelId}&ev=PageView&noscript=1`);
    var noscript = document.createElement('noscript');
    noscript.append(img);
    this.appendHead(noscript);
  }

  public get pixelId() {
    return this._config.providers.facebookPixel?.pixelId;
  }
}