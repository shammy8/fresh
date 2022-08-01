import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    NgIf,
    // IfModule, // TODO doesn't remove the spinner once route is loaded
    MatProgressSpinnerModule,
  ],
  selector: 'fresh-root',
  template: `
    <mat-spinner *ngIf="!isRouteLoaded"></mat-spinner>
    <router-outlet (activate)="isRouteLoaded = !!$event"></router-outlet>
  `,
  styles: [
    `
      mat-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  isRouteLoaded = false;
}
