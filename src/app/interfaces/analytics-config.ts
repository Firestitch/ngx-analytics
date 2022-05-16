export interface FsAnalyticsConfig {
  pageTracking?: {
    clearIds?: boolean, //https://github.com/angulartics/angulartics2#remove-ids-from-url-paths
    clearQueryParams?: boolean, //https://github.com/angulartics/angulartics2#remove-query-params-from-url-paths
 },
 googleAnalytics?: {
    trackingId?: string,
 }
}