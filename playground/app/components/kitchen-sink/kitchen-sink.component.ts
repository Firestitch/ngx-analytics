import { Component } from '@angular/core';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { FsAnalytics } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent {

  public config = {};

  constructor(
    private exampleComponent: FsExampleComponent,
    private message: FsMessage,
    private _analytics: FsAnalytics,
  ) {}

  public manualEvent() {
    this._analytics.trackEvent('manual_event');
  }
}
