import { ModuleWithProviders, NgModule } from '@angular/core';

import { FsAnalyticsDirective } from './directives/analytics';

import { FsAnalyticsConfig } from './interfaces';


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
      // providers: [
      //   {
      //     useClass:
      //   }
      // ]
    };
  }
}
