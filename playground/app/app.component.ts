import { Component } from '@angular/core';
import { FsAnalytics } from '@firestitch/analytics';
import { RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {

  public constructor(
    private _analytics: FsAnalytics,
  ) {
    _analytics.init();
  }
}
