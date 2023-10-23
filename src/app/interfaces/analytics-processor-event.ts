
import { EventType } from '../enums';


export interface AnalyticsProcessorEvent {
  type: string | EventType,
  data: any
}