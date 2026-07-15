import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { CustomProviderConfig, FS_ANALYTICS_CONFIG, FsAnalytics, FsAnalyticsConfig, ProviderActivity, ProviderConfig } from '@firestitch/analytics';

import { Subscription } from 'rxjs';


interface LogRow {
  time: string;
  kind: ProviderActivity['kind'];
  provider: string | null;
  action: string;
  detail: string;
}

interface ProviderRow {
  name: string;
  kind: 'built-in' | 'custom';
  // For custom providers we can re-add them at runtime; built-ins are wired up at init.
  config?: CustomProviderConfig;
  // Whether it's currently registered/running.
  active: boolean;
}

/**
 * One page that shows the whole Firestitch Analytics surface working:
 *
 *  - PROVIDER PANEL (top): every provider, whether it's currently active, and
 *    per-provider Init / Destroy buttons. Answers "what's loaded" and "can I
 *    destroy one provider".
 *  - EVENTS (left): generic ecommerce + custom events. Each calls FsAnalytics.
 *  - LIVE LOG (right): driven by FsAnalytics.activity$ — shows the app call, then
 *    one row per ACTIVE provider that received it, tagged by provider. Destroy a
 *    provider and its rows stop appearing while the others keep going.
 *
 * Nothing here is app-specific — it's a generic analytics demo.
 */
@Component({
  selector: 'app-analytics-demo',
  templateUrl: './analytics-demo.component.html',
  styleUrls: ['./analytics-demo.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class AnalyticsDemoComponent implements OnInit, OnDestroy {

  public log: LogRow[] = [];
  public providers: ProviderRow[] = [];

  private _analytics = inject(FsAnalytics);
  private _config = inject<FsAnalyticsConfig>(FS_ANALYTICS_CONFIG);
  private _sub = new Subscription();

  private _product = {
    total: 79.99,
    currency: 'USD',
    items: [
      { id: 'sku_42', name: 'Wireless Headphones', price: 79.99, quantity: 1, category: 'Audio' },
    ],
  };

  public ngOnInit(): void {
    // Live log: every app call + per-provider receipt + init/destroy.
    this._sub.add(
      this._analytics.activity$.subscribe((activity) => this._onActivity(activity)),
    );

    this._refreshProviders();
  }

  public ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  // ---- Provider panel actions ----

  public initProvider(row: ProviderRow): void {
    if (row.config) {
      this._analytics.addCustomProvider(row.config);
    }
    // (Built-ins can't be re-added at runtime in this demo — they're config-time.)
    this._refreshProviders();
  }

  public destroyProvider(row: ProviderRow): void {
    this._analytics.destroyProvider(row.name);
    this._refreshProviders();
  }

  public destroyAll(): void {
    this._analytics.destroy();
    this._refreshProviders();
  }

  // ---- Event actions (generic ecommerce) ----

  public addToCart(): void {
    this._analytics.addToCart(this._product); 
  }
  public removeFromCart(): void {
    this._analytics.removeFromCart(this._product); 
  }
  public beginCheckout(): void {
    this._analytics.beginCheckout(this._product); 
  }
  public addPayment(): void {
    this._analytics.addPayment({ ...this._product, paymentType: 'credit_card' }); 
  }

  public purchase(): void {
    this._analytics.purchase({
      ...this._product,
      transactionId: `txn_${  Math.floor(Math.random() * 1e9)}`,
      shipping: 5.0,
    });
  }

  public customEvent(): void {
    this._analytics.trackEvent('newsletter_signup', { source: 'footer' });
  }

  public identify(): void {
    this._analytics.setUser({ email: 'jane@example.com', firstName: 'Jane', lastName: 'Doe' });
  }

  public clearLog(): void {
    this.log = [];
  }

  // ---- internals ----

  // Build the panel straight from the configured providers — no hardcoded
  // lists. Each entry in the app config becomes one row; whether it's currently
  // running comes from the service.
  private _refreshProviders(): void {
    this.providers = (this._config.providers || []).map((providerConfig: ProviderConfig) => {
      const custom = providerConfig.type === 'custom' ? providerConfig : null;
      const name = custom ? custom.name : providerConfig.type;

      return {
        name,
        kind: custom ? 'custom' : 'built-in',
        config: custom ?? undefined,
        active: this._analytics.hasProvider(name),
      };
    });
  }

  private _onActivity(activity: ProviderActivity): void {
    const now = new Date();
    const time = `${now.toTimeString().slice(0, 8)  }.${  String(now.getMilliseconds()).padStart(3, '0')}`;

    this.log = [
      {
        time,
        kind: activity.kind,
        provider: activity.provider,
        action: activity.action,
        detail: activity.data !== undefined ? this._short(activity.data) : '',
      },
      ...this.log,
    ].slice(0, 200);

    // init/destroy changes provider state — reflect it in the panel.
    if (activity.kind === 'init' || activity.kind === 'destroy') {
      this._refreshProviders();
    }
  }

  private _short(data: any): string {
    try {
      const s = JSON.stringify(data);

      return s.length > 120 ? `${s.slice(0, 117)  }…` : s;
    } catch {
      return String(data);
    }
  }
}
