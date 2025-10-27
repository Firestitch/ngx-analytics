import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FS_ANALYTICS_CONFIG, FsAnalyticsModule } from '@firestitch/analytics';
import { appAnalyticsConfig } from './app/app-analytics-config';
import { AnalyticsProcessorService } from './app/service/analytics-processor.service';
import { RouterModule, provideRouter, Routes } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsLabelModule } from '@firestitch/label';
import { FsStoreModule } from '@firestitch/store';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { ToastrModule } from 'ngx-toastr';
import { ExamplesComponent } from './app/components';
import { AppComponent } from './app/app.component';

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
            deps: [AnalyticsProcessorService]
        },
        provideAnimations(),
        provideRouter(routes)
    ]
})
  .catch(err => console.error(err));

