import { Component } from '@angular/core';
import { environment } from '@env';
import { FsExampleModule } from '@firestitch/example';
import { AnalyticsDemoComponent } from '../analytics-demo/analytics-demo.component';


@Component({
    templateUrl: 'examples.component.html',
    standalone: true,
    imports: [FsExampleModule, AnalyticsDemoComponent]
})
export class ExamplesComponent {
  public config = environment;
}
