import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { AnalyticsProcessor, AnalyticsProcessorEvent } from '../interfaces';


@Injectable({
  providedIn: 'root',
})
export class AnalyticsProcessorService implements AnalyticsProcessor {

  public process(event: AnalyticsProcessorEvent): Observable<AnalyticsProcessorEvent> {
    return of(event);
  }

}

