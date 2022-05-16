import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsAnalytics } from '../../services/analytics.service';


@Directive({
  selector: '[fsAnalytics]'
})
export class FsAnalyticsDirective implements OnInit, OnDestroy {

  @Input('fsAnalytics') public action = '';
  @Input() public event = 'click';

  private _destroy$ = new Subject();
  
  public constructor(
    private _analytics: FsAnalytics,
    private _el: ElementRef,
  ) {}

  public ngOnInit(): void {
    fromEvent(this._el.nativeElement, this.event)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe(() => {
      this._analytics.trackEvent(this.action);
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
