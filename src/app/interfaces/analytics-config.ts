import { AnalyticsProcessor } from "./analytics-processor"

export interface FsAnalyticsConfig {
  providers?: {
    googleAnalytics?: {
      measurementId: string,
    },
    googleTagManager?: {
      containerId: string,
      scriptDomain?: string,
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
