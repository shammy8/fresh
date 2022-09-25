import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Observable, Subject, takeUntil } from 'rxjs';

// import { LetModule } from '@rx-angular/template/let';

import { UserService } from '../services/user.service';
import { UserDetails } from '../item.interface';

@Component({
  standalone: true,
  imports: [
    // LetModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    ClipboardModule,
    // // IfModule,
  ],
  selector: 'fresh-user-profile',
  templateUrl: './user-profile.component.html',
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
      .name-control-button-container,
      mat-slide-toggle {
        justify-self: end;
      }
    `,
  ],
})
export class UserProfileComponent implements OnDestroy {
  newNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(30), Validators.required],
  });

  isEditMode = false;

  notificationControl = new FormControl<boolean>(
    Notification.permission === 'granted'
  );

  private readonly _destroy = new Subject<void>();

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<UserProfileComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      userDoc$: Observable<UserDetails>;
    },
    private _userService: UserService
  ) {
    this.notificationControl.valueChanges
      .pipe(takeUntil(this._destroy))
      .subscribe((allow) => {
        // TODO
        if (allow === true) {
          console.log('allow');
        } else if (allow === false) {
          console.log('deny');
        }
      });
  }

  onEdit(displayName: string) {
    this.isEditMode = true;
    this.newNameControl.setValue(displayName);
  }

  async saveDisplayName(uid: string) {
    if (this.newNameControl.invalid) return;

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

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
