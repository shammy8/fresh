import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  standalone: true,
  imports: [MatExpansionModule],
  selector: 'fresh-no-home-selected',
  template: `
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
        margin: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoHomeSelectedComponent {}
