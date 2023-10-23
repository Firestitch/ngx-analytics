import { Observable } from 'rxjs';

import { AnalyticsProcessorEvent } from './analytics-processor-event';


export interface AnalyticsProcessor {

  process(data: AnalyticsProcessorEvent): Observable<AnalyticsProcessorEvent>;
}