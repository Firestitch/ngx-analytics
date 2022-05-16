import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsAnalyticsModule } from '@firestitch/analytics';
import { FsLabelModule } from '@firestitch/label';
import { FsStoreModule } from '@firestitch/store';
import { FsHtmlEditorModule } from '@firestitch/html-editor';

import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';
import {
  ExamplesComponent, KitchenSinkComponent
} from './components';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
  { path: 'contact', component: ExamplesComponent },
  { path: 'about', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    RouterModule,
    BrowserModule,
    FsAnalyticsModule.forRoot({
      googleAnalytics: {
        trackingId: 'G-BW04NF6H7W',
      }
    }),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsStoreModule,
    FsExampleModule.forRoot(),
    FsHtmlEditorModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AppComponent,
    KitchenSinkComponent,
    ExamplesComponent,
  ],
})
export class PlaygroundModule {
}
