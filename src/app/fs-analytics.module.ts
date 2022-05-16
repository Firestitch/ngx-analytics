import { NgModule, ModuleWithProviders } from '@angular/core';

import { FsAnalyticsDirective } from './directives/analytics';

import { FS_ANALYTICS_CONFIG } from './injectors';
import { FsAnalyticsConfig } from './interfaces';
import { FsAnalytics } from './services/analytics.service';


@NgModule({
  declarations: [
    FsAnalyticsDirective,
  ],
  exports: [
    FsAnalyticsDirective,
  ]
})
export class FsAnalyticsModule {
  static forRoot(config: FsAnalyticsConfig = {}): ModuleWithProviders<FsAnalyticsModule> {
    return {
      ngModule: FsAnalyticsModule,
    };
  }
}
