import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs';

import { Home, UserDetails } from '../item.interface';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'fresh-manage-users',
  templateUrl: './manage-users.component.html',
  styles: [
    `
      mat-icon {
        margin-left: auto;
        cursor: pointer;
      }
      .userId-text {
        font-size: 12px !important;
        opacity: 0.8;
      }
      .no-display-name-text {
        font-style: italic;
        opacity: 0.8;
      }
      mat-form-field {
        width: 100%;
      }
      .button-container {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 20px;
      }
    `,
  ],
})
export class ManageUsersComponent {
  // newUserIdControl = new FormControl<string>('', { nonNullable: true });

  newUserEmailControl = new FormControl<string>('', {
    validators: [Validators.email],
    nonNullable: true,
  });

  isLoadingAddUser = false;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ManageUsersComponent>,
    private _homeService: HomeService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      userDoc$: Observable<UserDetails>;
      home$: Observable<Home>;
    }
  ) {}

  async addUserEmailToForm(homeId: string) {
    if (!this.newUserEmailControl.value || !this.newUserEmailControl.valid)
      return;

    try {
      this.isLoadingAddUser = true;
      await this._homeService.addUserToHomeUsingEmail(
        homeId,
        this.newUserEmailControl.value
      );
      this.newUserEmailControl.reset();
      this._snackBar.open('Successfully Added User', 'Close');
      this.isLoadingAddUser = false;
    } catch (error) {
      this.newUserEmailControl.setErrors({ backendError: error });
      this._snackBar.open('Error Adding User', 'Close');
      this.isLoadingAddUser = false;
    }
  }

  async deleteUserId(
    homeId: string,
    userId: string,
    userDocUid: string,
    userEmail: string
  ) {
    if (
      userId === userDocUid &&
      !confirm(
        `Removing yourself will mean you no longer have access to the home until a user adds you back in. Are you sure you want to continue?`
      )
    ) {
      return;
    } else if (
      !confirm(`Are you sure you want to remove ${userEmail} from this home?`)
    ) {
      return;
    }

    try {
      await this._homeService.deleteUser(homeId, userId);
      this._snackBar.open('Successfully Deleted User', 'Close');
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Deleting User', 'Close');
    }
  }

  closeBottomSheet(docRef?: string) {
    this._bottomSheetRef.dismiss(docRef);
  }
}
