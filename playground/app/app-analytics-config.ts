import { FsAnalyticsConfig } from '@firestitch/analytics';


export function appAnalyticsConfig(): FsAnalyticsConfig {
  return {
    // googleAnalytics: {
    //   measurementId: 'G-BW04NF6H7W',
    // },
    googleTags: {
      containerId: 'GTM-KKTK9W4',
    },
    // facebookPixel: {
    //   pixelId: '312316924264208',
    // }
  };
}
