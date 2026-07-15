import { FsAnalyticsConfig } from '@firestitch/analytics';

import { AnalyticsProcessorService } from './service/analytics-processor.service';


// The providers active for the whole playground. Every provider — built-in or
// custom — is one entry in this array, discriminated by `type`. googleAnalytics
// and facebookPixel are commented out (no test accounts), but they're built-in
// types you can enable the same way; the demo panel lists them as "not
// configured" so you can see the full set the library supports.
export function appAnalyticsConfig(analyticsProcessorService: AnalyticsProcessorService): FsAnalyticsConfig {
  return {
    providers: [
      { type: 'googleTagManager', containerId: 'GTM-PW823QMF', scriptDomain: 'gtm.cure.dev.firestitch.com' },
      { type: 'klaviyo', publicApiKey: 'SjntuF' },
      { type: 'googleAnalytics', measurementId: 'G-BW04NF6H7W' },
      { type: 'facebookPixel', pixelId: '000000000000000' },
      {
        type: 'custom',
        name: 'custom-demo',
        scriptUrl: 'assets/mock-tracker.js',
        // Single readiness hook: kicks off the tracker's async handshake and
        // resolves true only once it completes. start() is idempotent (returns the
        // same Promise on every call), so re-polling it just awaits the one
        // in-flight handshake. Events fired before it resolves are buffered and
        // flushed, in order. The `?? false` handles the tick before the script has
        // loaded and installed window.mockTracker.
        onReady: () => (window as any).mockTracker?.start() ?? false,
        trackEvent: (type, data) => (window as any).mockTracker?.track(type, data),
        setUser: (data) => (window as any).mockTracker?.identify(data),
        onDestroy: () => (window as any).mockTracker?.destroy?.(),
      },
    ],
    processor: analyticsProcessorService,
  };
}
