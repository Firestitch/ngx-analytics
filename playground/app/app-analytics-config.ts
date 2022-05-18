import { FsAnalyticsConfig } from '@firestitch/analytics';


export function appAnalyticsConfig(): FsAnalyticsConfig {
  return {
    googleAnalytics: {
      measurementId: 'G-BW04NF6H7W',
    },
    facebookPixel: {
      pixelId: '312316924264208',
    }
  };
}
