import { Provider } from "./provider";


export class KlaviyoProvider extends Provider {

  public init() {
    (window as any)._learnq = (window as any)._learnq || [];

    if(this.publicApiKey) {
      this.addScript(`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this.publicApiKey}`);
    }
  }

  public trackPage(path: string): void {
    this.trackEvent('Page View', { path });
  }

  public trackEvent(action: any, value?: any): void {
    (window as any)._learnq.push(['track', action, value ]);
  }
  
  public setUser(data) {
    data = Object.keys(data)
      .reduce((accum, name) => {
        switch(name) {
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

    (window as any)._learnq.push(['identify', data]);
  }

  public get publicApiKey() {
    return this._config.klaviyo?.publicApiKey;
  }
}