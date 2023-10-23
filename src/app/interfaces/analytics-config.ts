import { AnalyticsProcessor } from "./analytics-processor"

export interface FsAnalyticsConfig {
  providers?: {
    googleAnalytics?: {
      measurementId: string,
    },
    googleTags?: {
      containerId: string,
    },
    facebookPixel?: {
      pixelId: string,
    },
    klaviyo?: {
      publicApiKey: string,
    }
  },
  processor?: AnalyticsProcessor
}
