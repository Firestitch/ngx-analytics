import { Component } from '@angular/core';
import { FsAnalytics } from '@firestitch/analytics';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public constructor(
    private _analytics: FsAnalytics,
  ) {
    _analytics.init();
  }
}
