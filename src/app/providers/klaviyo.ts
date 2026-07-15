import { KlaviyoProviderConfig, PurchaseEvent } from '../interfaces';

import { Provider } from './provider';


export class KlaviyoProvider extends Provider {

  public readonly name = 'klaviyo';

  private _preloadData = [];
  // Handles for the flush timers scheduled in init(), so destroy() can cancel any
  // that haven't fired yet (otherwise they keep pushing after teardown).
  private _flushTimers: any[] = [];

  public init() {
    if (this.publicApiKey) {
      this.addScript(`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this.publicApiKey}`)
        .then(() => {
          for(let i = 1; i <= 10; i++) {
            this._flushTimers.push(setTimeout(() => {
              if(this.klaviyo?.push) {
                this._preloadData
                  .forEach((data) => {
                    this.klaviyo.push(data);
                  });
                this._preloadData = [];
              }
            }, i * 1000));
          }
        });
    }
  }

  public destroy(): void {
    // Removes the router subscription and the injected klaviyo.js <script> node.
    super.destroy();

    // Cancel any flush timers that haven't fired yet so they don't push buffered
    // events after teardown.
    this._flushTimers.forEach((timer) => clearTimeout(timer));
    this._flushTimers = [];
    this._preloadData = [];
  }

  public get klaviyo(): any {
    return (window as any).klaviyo;
  }

  public trackPage(path: string): void {
    this.trackEvent('Page View', { path });
  }

  public purchase(data: PurchaseEvent): void {
    this.trackEvent('Purchase', data);
  }

  public trackEvent(action: any, value?: any): void {
    if(this.klaviyo?.track) {
      this.klaviyo.track(action, value);
    } else {
      this._preloadData.push(['track', action, value]);
    }
  }

  public setUser(data) {
    data = Object.keys(data)
      .reduce((accum, name) => {
        switch (name) {
          case 'email':
            accum['email'] = data[name];
            break;

          case 'firstName':
            accum['first_name'] = data[name];
            break;

          case 'lastName':
            accum['last_name'] = data[name];
            break;

          default:
            accum[name] = data[name];
        }

        return accum;
      }, {});

    if(this.klaviyo?.identify) {
      this.klaviyo.identify(data);
    } else {
      this._preloadData.push(['identify', data]);
    }
  }

  public get publicApiKey() {
    return (this._providerConfig as KlaviyoProviderConfig)?.publicApiKey;
  }
}
