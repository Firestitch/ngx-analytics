import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { FS_ANALYTICS_CONFIG, FsAnalyticsModule } from '@firestitch/analytics';
import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsStoreModule } from '@firestitch/store';

import { ToastrModule } from 'ngx-toastr';

import { appAnalyticsConfig } from './app-analytics-config';
import { AppComponent } from './app.component';
import {
  ExamplesComponent, KitchenSinkComponent
} from './components';
import { AppMaterialModule } from './material.module';
import { AnalyticsProcessorService } from './service/analytics-processor.service';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
  { path: 'contact', component: ExamplesComponent },
  { path: 'about', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    RouterModule,
    BrowserModule,
    FsAnalyticsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsStoreModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AppComponent,
    KitchenSinkComponent,
    ExamplesComponent,
  ],
  providers: [
    {
      provide: FS_ANALYTICS_CONFIG,
      useFactory: appAnalyticsConfig,
      deps: [AnalyticsProcessorService]
    },
  ]
})
export class PlaygroundModule {
}