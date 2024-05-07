import { PurchaseEvent } from '../interfaces';
import { Provider } from "./provider";


export class KlaviyoProvider extends Provider {

  public init() {
    (window as any).klaviyo = (window as any).klaviyo || [];

    if (this.publicApiKey) {
      this.addScript(`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this.publicApiKey}`);
    }
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
    if(this.klaviyo.track) {
      this.klaviyo.track(action, value);
    } else {
      this.klaviyo.push(['track', action, value]);
    }
  }

  public setUser(data) {
    data = Object.keys(data)
      .reduce((accum, name) => {
        switch (name) {
          case 'email':
            accum['$email'] = data[name];
            break;

          case 'firstName':
            accum['$first_name'] = data[name];
            break;

          case 'lastName':
            accum['$last_name'] = data[name];
            break;

          default:
            accum[name] = data[name];
        }

        return accum;
      }, {});

      if(this.klaviyo.identify) {
        this.klaviyo.identify(data);
      } else {
        this.klaviyo.push(['identify', data]);
      }
  }

  public get publicApiKey() {
    return this._config.providers.klaviyo?.publicApiKey;
  }
}