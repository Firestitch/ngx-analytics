import { FsAnalyticsConfig } from '@firestitch/analytics';
import { AnalyticsProcessorService } from './service/analytics-processor.service';


export function appAnalyticsConfig(analyticsProcessorService: AnalyticsProcessorService): FsAnalyticsConfig {
  return {
    providers: {
      // googleAnalytics: {
      //   measurementId: 'G-BW04NF6H7W',
      // },
      googleTagManager: {
        containerId: 'GTM-PW823QMF',
        scriptDomain: 'gtm.cure.dev.firestitch.com',
      },
      klaviyo: {
        publicApiKey: 'SjntuF',
      }
    },
    processor: analyticsProcessorService
  };
}
