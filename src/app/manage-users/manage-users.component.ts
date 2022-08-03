import { KeyValuePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LetModule } from '@rx-angular/template';
import { ForModule } from '@rx-angular/template/experimental/for';
import { IfModule } from '@rx-angular/template/experimental/if';

import { Observable } from 'rxjs';

import { Home, UserDetails } from '../item.interface';
import { HomeService } from '../services/home.service';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    LetModule,
    ForModule,
    IfModule,
  ],
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
    let closeBottomSheetAndNavigate = false;

    if (userId === userDocUid) {
      if (
        confirm(
          `Removing yourself will mean you no longer have access to the home until a user adds you back in. Are you sure you want to continue?`
        )
      ) {
        closeBottomSheetAndNavigate = true;
      } else {
        return;
      }
    } else if (
      !confirm(`Are you sure you want to remove ${userEmail} from this home?`)
    ) {
      return;
    }

    try {
      if (closeBottomSheetAndNavigate === true) {
        this.closeBottomSheet(true);
      }
      await this._homeService.deleteUser(homeId, userId);
      this._snackBar.open('Successfully Deleted User', 'Close');
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Deleting User', 'Close');
    }
  }

  closeBottomSheet(navBackToMain: boolean) {
    this._bottomSheetRef.dismiss(navBackToMain);
  }
}
