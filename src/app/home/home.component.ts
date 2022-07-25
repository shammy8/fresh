import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'fresh-home',
  template: `
    <mat-tab-group
      animationDuration="0ms"
      mat-stretch-tabs
      color="accent"
      [selectedIndex]="tabIndex"
      (selectedIndexChange)="selectedIndexChange($event)"
    >
      <mat-tab label="Inventory">
        <fresh-inventory></fresh-inventory>
      </mat-tab>
      <mat-tab label="Shopping List">
        <fresh-shopping-list></fresh-shopping-list>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
    `
      ::ng-deep .mat-tab-body-content {
        padding: 0 10px;
        height: calc(100vh - 49px - 64px) !important;
        /* 49px is tab height, TODO refactor? */
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnDestroy {
  tabIndex: 0 | 1 = 0;

  private readonly _destroy = new Subject<void>();

  constructor(
    private readonly _location: Location,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute
  ) {
    this._route.queryParamMap
      .pipe(takeUntil(this._destroy))
      .subscribe((queryParamMap) => {
        this.tabIndex = queryParamMap.get('tab') === '1' ? 1 : 0;
      });
  }

  /**
   * Change the url when users changes tab without reloading the component
   * @param tabIndex The tab index chosen
   */
  selectedIndexChange(tabIndex: number) {
    const url = this._router
      .createUrlTree([], {
        relativeTo: this._route,
        queryParams: { tab: tabIndex },
        queryParamsHandling: 'merge',
      })
      .toString();
    this._location.go(url); // change the url without navigating, this doesn't fire the ActivatedRoute.queryParamMap
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
