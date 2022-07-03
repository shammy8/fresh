import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';
import { UserDetails } from '../item.interface';

@Component({
  selector: 'fresh-user',
  templateUrl: './user.component.html',
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
export class UserComponent {
  newNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(30)],
  });

  isEditMode = false;

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<UserComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      userDoc$: Observable<UserDetails>;
    },
    private _userService: UserService
  ) {}

  onEdit(displayName: string) {
    this.isEditMode = true;
    this.newNameControl.setValue(displayName);
  }

  async saveDisplayName(uid: string) {
    if (!this.newNameControl.value) return;

    try {
      await this._userService.updateDisplayName(uid, this.newNameControl.value);
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
}
