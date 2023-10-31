import { Component } from '@angular/core';
import { FsAnalytics } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent {

  public config = {};

  constructor(
    private _analytics: FsAnalytics,
  ) { }

  public manualEvent() {
    this._analytics.trackEvent('manual_event');
  }

  public purchase() {
    this._analytics.purchase({
      transactionId: '3498763429',
      total: 35.65,
      shipping: 10.52,
      products: [
        {
          id: '23324',
          name: 'T-Shirt',
          price: 35.00,
          quantity: 1,
        }
      ]
    });
  }
}
