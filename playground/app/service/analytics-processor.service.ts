import { Injectable } from '@angular/core';

import { AnalyticsProcessor, AnalyticsProcessorEvent } from '@firestitch/analytics';

import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AnalyticsProcessorService implements AnalyticsProcessor {

  public process(event: AnalyticsProcessorEvent): Observable<AnalyticsProcessorEvent> {
    return of(event);
    // .pipe(
    //   switchMap((data) => {
    //     return event.type === 'purchase' ? of(null).pipe(filter(() => false)) : of(data);
    //   }),
    // );
  }
}

