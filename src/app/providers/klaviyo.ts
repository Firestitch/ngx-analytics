import { PurchaseEvent } from "../interfaces";
import { Provider } from "./provider";


export class KlaviyoProvider extends Provider {
  
  private _preloadData = [];

  public init() {
    if (this.publicApiKey) {
      this.addScript(`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this.publicApiKey}`)
        .then(() => {
          for(let i=1; i <= 10; i++) {            
            setTimeout(() => {
              if(this.klaviyo?.push) {
                this._preloadData
                  .forEach((data) => {
                    this.klaviyo.push(data);
                  });
                this._preloadData = [];
              }
            }, i * 1000);
          }
        });
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
    return this._config.providers.klaviyo?.publicApiKey;
  }
}