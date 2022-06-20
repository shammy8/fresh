import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fresh-no-home-selected',
  template: `
    <!-- TODO maybe change this to a mat card? -->
    <mat-expansion-panel hideToggle>
      <mat-expansion-panel-header>
        <mat-panel-title>
          Please select or create a home in the side menu.</mat-panel-title
        >
      </mat-expansion-panel-header>
    </mat-expansion-panel>
  `,
  styles: [
    `
      mat-expansion-panel {
        margin: 5px 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoHomeSelectedComponent {}
