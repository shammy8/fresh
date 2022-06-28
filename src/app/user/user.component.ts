import { Component, Inject } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UserService } from '../services/user.service';

@Component({
  selector: 'fresh-user',
  template: `
    <div *ngIf="userDoc$ | async as user" class="grid">
      <!-- <pre> {{ user | json }} </pre> -->
      <h2>
        {{ user.displayName }}
      </h2>

      <button mat-icon-button matTooltip="Edit display name">
        <mat-icon>edit</mat-icon>
      </button>

      <p>{{ user.uid }}</p>

      <button
        mat-icon-button
        [cdkCopyToClipboard]="user.uid"
        matTooltip="Copy user ID"
      >
        <mat-icon>content_copy</mat-icon>
      </button>

      <p>{{ user.email }}</p>
      <button
        mat-icon-button
        [cdkCopyToClipboard]="user.email"
        matTooltip="Copy email"
      >
        <mat-icon>content_copy</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: 1fr 50px;
        grid-template-rows: 1.5fr 1fr 1fr;
        align-items: center;
      }
      h2,
      p {
        margin-bottom: 0;
      }
    `,
  ],
})
export class UserComponent {
  userDoc$ = this._userService.fetchUser();

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      userId: string;
    },
    private _userService: UserService
  ) {}
}
