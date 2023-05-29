export interface FsAnalyticsConfig {
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
}
