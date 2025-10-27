import { Component, inject } from '@angular/core';
import { FsAnalytics } from '@firestitch/analytics';
import { RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {
  private _analytics = inject(FsAnalytics);


  public constructor() {
    const _analytics = this._analytics;

    _analytics.init();
  }
}
