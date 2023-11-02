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

  public payment = {
    total: 35.65,
    items: [
      {
        id: '23324',
        name: 'T-Shirt',
        price: 35.00,
        quantity: 1,
        category: 'Category A',
        category2: 'Category B',
      }
    ]
  };

  public addPayment() {
    this._analytics.beginCheckout(this.payment);
  }

  public beginCheckout() {
    this._analytics.beginCheckout(this.payment);
  }

  public addToCart() {
    this._analytics.addToCart(this.payment);
  }

  public removeFromCart() {
    this._analytics.removeFromCart(this.payment);
  }

  public purchase() {
    this._analytics.purchase({
      ...this.payment,
      transactionId: '3498763429',
      shipping: 10.52
    });
  }
}
