import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

import { Observable, Subject, takeUntil } from 'rxjs';

import { UserService } from '../services/user.service';
import { UserDetails } from '../item.interface';

@Component({
  selector: 'fresh-user',
  template: `
    <div *ngIf="userDoc$ | async as user" class="grid">
      <ng-container *ngIf="!isEditMode; else viewModeTemplate">
        <h2>
          {{ user.displayName }}
        </h2>

        <button
          mat-icon-button
          matTooltip="Edit display name"
          (click)="onEdit(user.displayName)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-container>

      <ng-template #viewModeTemplate>
        <mat-form-field>
          <input
            matInput
            [formControl]="newNameControl"
            placeholder="New display name"
            name="displayName"
          />
          <mat-error *ngIf="newNameControl.hasError('maxlength')"
            >Name must be less than 31 characters</mat-error
          >
        </mat-form-field>

        <div class="name-control-button-container">
          <button
            mat-icon-button
            matTooltip="Cancel"
            (click)="isEditMode = false"
          >
            <mat-icon>clear</mat-icon>
          </button>
          <button
            mat-icon-button
            matTooltip="Save display name"
            (click)="saveDisplayName()"
          >
            <mat-icon>check</mat-icon>
          </button>
        </div>
      </ng-template>

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

      <div></div>
      <button mat-button type="button" (click)="closeBottomSheet()">
        Close
      </button>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: 1fr 80px;
        grid-template-rows: 1.5fr 1fr 1fr 1fr;
        align-items: center;
      }
      h2,
      p {
        margin-bottom: 0;
      }
      button,
      .name-control-button-container {
        justify-self: end;
      }
    `,
  ],
})
export class UserComponent implements OnDestroy {
  userDoc$ = this._userService.fetchUserDoc();

  newNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(30)],
  });

  isEditMode = false;

  private _userDoc: UserDetails = { displayName: '', email: '', uid: '' };

  private _destroy = new Subject<void>();

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<UserComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private _data: {
      userDoc$: Observable<UserDetails>;
    },
    private _userService: UserService
  ) {
    this._data.userDoc$
      .pipe(takeUntil(this._destroy))
      .subscribe((user) => (this._userDoc = user));
  }

  onEdit(displayName: string) {
    this.isEditMode = true;
    this.newNameControl.setValue(displayName);
  }

  async saveDisplayName() {
    if (!this.newNameControl.value) return;

    try {
      await this._userService.updateDisplayName(
        this._userDoc.uid,
        this.newNameControl.value
      );
      this._snackBar.open('Successfully Updated Display Name', 'Close');
      this.isEditMode = false;
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Updating Display Name', 'Close');
    }
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }
}
