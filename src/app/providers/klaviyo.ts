import { Provider } from "./provider";


export class KlaviyoProvider extends Provider {

  public init() {
    (window as any)._learnq = (window as any)._learnq || [];

    if(this.publicApiKey) {
      this.addScript(`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this.publicApiKey}`);
    }
  }

  public trackPage(path: string): void {
    this.trackEvent('PageView', { path });
  }

  public trackEvent(action: any, value?: any): void {
    (window as any)._learnq.push([ action, value ]);
  }
  
  public get publicApiKey() {
    return this._config.klaviyo?.publicApiKey;
  }
}