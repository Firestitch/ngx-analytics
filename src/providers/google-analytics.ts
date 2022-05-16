import { Provider } from "./provider";

import { Angulartics2GoogleAnalytics } from 'angulartics2';

declare let gtag: Function;

export class GoogleAnalyticsProvider extends Provider {

  public init() {
    var script = document.createElement('script');    
    script.src = 'https://www.google-analytics.com/analytics.js';
    script.setAttribute('async','async');
    script.onload = () => {
      this.ga('create', this.trackingId, 'auto');
    };

    document.getElementsByTagName('head')[0].appendChild(script);

    // script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    // script.setAttribute('async','');
    // document.getElementsByTagName('head')[0].appendChild(script);

    // this.window.dataLayer = this.window.dataLayer || [];
    // this.window.gtag = function () {
    //   (window as any).dataLayer.push(arguments); 
    // }  

    // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    //   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    //   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    //   })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    // gtag('js', new Date());
    // gtag('config', this.trackingId, { path_path:  this._router.url });
    
    // this._router.events.pipe(
    //   skip(1),
    //   filter(event => event instanceof NavigationEnd)
    // )
    // .subscribe((event: NavigationEnd) => {
    //   gtag('config', this.trackingId, { page_path: event.urlAfterRedirects });
    // });

    this._injector.get(Angulartics2GoogleAnalytics)
      .startTracking();
  }

  public gtag(name, value, options = {}) {
    this.window.gtag(name, value, options);
  }

  public ga(name, value, options = '') {
    this.window.ga(name, value, options);
  }

  public get trackingId() {
    return this._config.googleAnalytics?.trackingId;
  }
}