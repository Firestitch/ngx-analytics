import { Provider } from "./provider";

import { filter } from 'rxjs/operators';
import { NavigationEnd } from "@angular/router";

declare let fbq: Function;


export class FacebookPixelProvider extends Provider {

  public init() {
    this.addScript();
    this.addImg();
  }

  public trackEvent(action: any, value?, options?): void {
    fbq('track', action, {
      ...options,
      value,
    });
  }

  public addScript(): void {
    const f = window as any;
    const n: any = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments);
    };

    if(!f._fbq) {
      f._fbq=n;
    }

    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];

    const onload = () => {
      fbq('init', this.pixelId);
      this.trackEvent('PageView');

      this._router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.trackEvent('PageView');
      });
    };

    super.addScript(`https://connect.facebook.net/en_US/fbevents.js`, onload);
  }

  public addImg(): void {
    var img = document.createElement('img');
    img.setAttribute('height','1');
    img.setAttribute('width','1');
    img.setAttribute('style','display:none');
    img.setAttribute('src',`https://www.facebook.com/tr?id=${this.pixelId}&ev=PageView&noscript=1`);
    var noscript = document.createElement('noscript');
    noscript.append(img);
    this.appendHead(noscript);
  }

  public get pixelId() {
    return this._config.facebookPixel?.pixelId;
  }
}