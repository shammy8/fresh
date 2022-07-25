import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fresh-home',
  template: `
    <mat-tab-group animationDuration="0ms">
      <mat-tab label="Inventory">
        <fresh-inventory></fresh-inventory>
      </mat-tab>
      <mat-tab label="Shopping List">
        <fresh-shopping-list></fresh-shopping-list>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
