import { NgModule, ModuleWithProviders } from '@angular/core';

import { Angulartics2Module } from 'angulartics2';
import { FsAnalyticsDirective } from './components/analytics';

import { FS_ANALYTICS_CONFIG } from './injectors';
import { FsAnalyticsConfig } from './interfaces';
import { FsAnalytics } from './services/analytics.service';


@NgModule({
  imports: [
    Angulartics2Module.forRoot(),
  ],
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
      providers: [
        {
          provide: FS_ANALYTICS_CONFIG,
          useValue: config,
        }
      ],
    };
  }

  constructor(
    private _analytics: FsAnalytics,
  ) {
    _analytics.init();
  }
}
