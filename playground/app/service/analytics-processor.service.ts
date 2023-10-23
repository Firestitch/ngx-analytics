import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';


import { AnalyticsProcessor, AnalyticsProcessorEvent } from '@firestitch/analytics';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsProcessorService implements AnalyticsProcessor {

  public process(event: AnalyticsProcessorEvent): Observable<AnalyticsProcessorEvent> {
    return of(event)
      .pipe(
        switchMap((data) => {
          return event.type === 'purchase' ? throwError(null) : of(data);
        }),
      );
  }
}

