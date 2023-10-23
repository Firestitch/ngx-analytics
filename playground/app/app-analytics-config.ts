import { FsAnalyticsConfig } from '@firestitch/analytics';
import { AnalyticsProcessorService } from './service/analytics-processor.service';


export function appAnalyticsConfig(analyticsProcessorService: AnalyticsProcessorService): FsAnalyticsConfig {
  return {
    providers: {
      googleAnalytics: {
        measurementId: 'G-BW04NF6H7W',
      },
      googleTags: {
        containerId: 'GTM-PW823QMF',
      },
      // klaviyo: {
      //   publicApiKey: '',
      // }
    },
    processor: analyticsProcessorService
  };
}
