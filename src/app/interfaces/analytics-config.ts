import { AnalyticsProcessor } from './analytics-processor';

// Every provider is configured as an entry in the `providers` array, discriminated
// by `type`. Built-in types carry their vendor settings; `custom` carries a name +
// callbacks for integrating any third-party tracker the library doesn't have built
// in. Using an array (not a keyed object) means you can register multiple custom
// providers and everything is uniform.

export interface GoogleAnalyticsProviderConfig {
  type: 'googleAnalytics',
  measurementId: string,
}

export interface GoogleTagManagerProviderConfig {
  type: 'googleTagManager',
  containerId: string,
  scriptDomain?: string,
}

export interface FacebookPixelProviderConfig {
  type: 'facebookPixel',
  pixelId: string,
}

export interface KlaviyoProviderConfig {
  type: 'klaviyo',
  publicApiKey: string,
}

// A custom provider defined entirely through config — the escape hatch for a
// third-party tracker. Injects an optional script and forwards analytics calls to
// the supplied callbacks. Give each a unique `name` so it can be torn down
// individually via FsAnalytics.destroyProvider(name).
export interface CustomProviderConfig {
  type: 'custom',
  name: string,
  // Loaded via Provider.addScript() on init. Omit if the tracker is already
  // present on the page.
  scriptUrl?: string,
  // Guards every forwarded call and doubles as the init hook — it's the single
  // "is the tracker usable?" signal. Return false (or a Promise resolving false)
  // until the injected script has installed its global and finished any handshake
  // it needs (e.g. () => !!window.cure, or a Promise for an async session/consent
  // request the tracker performs on load). Calls are buffered until it resolves
  // true, then flushed in order. Kick off that handshake here on first call — the
  // gate is re-evaluated on every forwarded call until it first passes, so make
  // the work idempotent (start once, return the same promise thereafter).
  onReady?: () => boolean | Promise<boolean>,
  trackEvent?: (type: string, data?: any) => void,
  setUser?: (data: any) => void,
  trackPage?: (path: string) => void,
  // Called from destroy() so the underlying tracker can remove its own
  // listeners/hooks (the provider only removes the script tag it injected).
  onDestroy?: () => void,
}

export type ProviderConfig =
  | GoogleAnalyticsProviderConfig
  | GoogleTagManagerProviderConfig
  | FacebookPixelProviderConfig
  | KlaviyoProviderConfig
  | CustomProviderConfig;

export interface FsAnalyticsConfig {
  providers?: ProviderConfig[],
  processor?: AnalyticsProcessor
}
