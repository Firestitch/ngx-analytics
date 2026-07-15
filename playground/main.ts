import { enableProdMode, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { RouterModule, Routes, provideRouter } from '@angular/router';

import { FS_ANALYTICS_CONFIG, FsAnalyticsModule } from '@firestitch/analytics';
import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsStoreModule } from '@firestitch/store';

import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { appAnalyticsConfig } from './app/app-analytics-config';
import { AppComponent } from './app/app.component';
import { ExamplesComponent } from './app/components';
import { AnalyticsProcessorService } from './app/service/analytics-processor.service';
import { environment } from './environments/environment';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
  { path: 'contact', component: ExamplesComponent },
  { path: 'about', component: ExamplesComponent },
];


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule, BrowserModule, FsAnalyticsModule, FormsModule, FsLabelModule, FsStoreModule, FsExampleModule.forRoot(), FsMessageModule.forRoot(), ToastrModule.forRoot({ preventDuplicates: true })),
    {
      provide: FS_ANALYTICS_CONFIG,
      useFactory: appAnalyticsConfig,
      deps: [AnalyticsProcessorService],
    },
    provideAnimations(),
    provideRouter(routes),
  ],
})
  .catch((err) => console.error(err));

