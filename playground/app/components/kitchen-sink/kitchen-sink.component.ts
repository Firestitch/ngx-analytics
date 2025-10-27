import { Component, OnInit, inject } from '@angular/core';
import { FsAnalytics } from 'src/app/services/analytics.service';
import { MatAnchor } from '@angular/material/button';
import { FsAnalyticsDirective } from '../../../../src/app/directives/analytics/analytics.directive';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-kitchen-sink',
    templateUrl: 'kitchen-sink.component.html',
    styleUrls: ['kitchen-sink.component.scss'],
    standalone: true,
    imports: [MatAnchor, FsAnalyticsDirective, RouterLink]
})
export class KitchenSinkComponent implements OnInit {
  private _analytics = inject(FsAnalytics);


  public config = {};

  ngOnInit(): void {
    this.beginCheckout();
  }

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
    this._analytics.addPayment(this.payment);
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
