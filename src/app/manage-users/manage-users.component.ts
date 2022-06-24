import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormRecord,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { Auth, authState } from '@angular/fire/auth';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject, takeUntil } from 'rxjs';

import { Home, ManageUsersFormGroup } from '../item.interface';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'fresh-manage-users',
  template: `
    <form [formGroup]="form" (ngSubmit)="saveForm()">
      <mat-list formGroupName="users">
        <mat-list-item *ngFor="let user of form.value.users | keyvalue">
          <div matLine class="userId-text">{{ user.key }}</div>
          <div matLine *ngIf="user.key === userId">You</div>
          <!-- <mat-form-field>
              <mat-label> {{ user.key }} </mat-label>
              <input matInput [formControlName]="user.key" />
            </mat-form-field> -->
          <mat-icon (click)="removeUserIdFromForm(user.key)">delete</mat-icon>
        </mat-list-item>

        <mat-list-item>
          <mat-form-field>
            <mat-label>User ID</mat-label>
            <input matInput [formControl]="newUserIdControl" />
            <mat-icon matSuffix type="button" (click)="addUserIdToForm()">
              add
            </mat-icon>
            <mat-hint align="end">
              Press the + button after entering the User ID</mat-hint
            >
          </mat-form-field>
        </mat-list-item>
      </mat-list>

      <mat-error *ngIf="form.hasError('minFormControlsInFormRecord', 'users')"
        >There must be at least one user</mat-error
      >
      <div class="button-container">
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="disableSubmitButton"
        >
          Save
        </button>
        <button mat-button type="button" (click)="closeBottomSheet()">
          Close
        </button>
      </div>
    </form>
  `,
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
      mat-form-field {
        width: 100%;
      }
      .mat-error {
        margin-top: 10px;
      }
      .button-container {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 20px;
      }
    `,
  ],
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  form = new FormGroup<ManageUsersFormGroup>({
    users: new FormRecord<FormControl<boolean>>(
      {},
      { validators: [minFormControlsInFormRecord(1)] }
    ),
  });

  newUserIdControl = new FormControl<string>('', { nonNullable: true });

  userId = '';

  disableSubmitButton = false;

  private _destroy = new Subject<void>();

  get usersFormRecord() {
    return this.form.get('users') as FormRecord<FormControl<boolean>>;
  }

  constructor(
    public auth: Auth,
    private _bottomSheetRef: MatBottomSheetRef<ManageUsersComponent>,
    private _homeService: HomeService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      home: Home;
    }
  ) {}

  ngOnInit(): void {
    authState(this.auth)
      .pipe(takeUntil(this._destroy))
      .subscribe((user) => {
        this.userId = user?.uid ?? '';
      });

    const users = this.data.home.users;
    for (const user of Object.keys(users)) {
      this.usersFormRecord.addControl(
        user,
        new FormControl(users[user], { nonNullable: true })
      );
    }
  }

  addUserIdToForm() {
    if (!this.newUserIdControl.value) return;

    this.usersFormRecord.addControl(
      this.newUserIdControl.value,
      new FormControl(true, { nonNullable: true })
    );
    this.newUserIdControl.reset();
  }

  removeUserIdFromForm(userId: string) {
    this.usersFormRecord.removeControl(userId);
  }

  async saveForm() {
    if (!this.form.valid) return;

    if (
      !confirm(`Any users added will have full control of the home including deleting the whole home and removing users.
Removing yourself will mean you no longer have access to the home until a user adds you back in.
Are you sure you want to continue?`)
    )
      return;

    this.disableSubmitButton = true;

    this.closeBottomSheet();

    try {
      await this._homeService.updateUsers(
        this.data.home.id,
        this.form.getRawValue().users
      );
      this._snackBar.open('Successfully Updated Users', 'Close');
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Updating Users', 'Close');
      this.disableSubmitButton = false;
      // TODO handle error better
    }
  }

  closeBottomSheet(docRef?: string) {
    this._bottomSheetRef.dismiss(docRef);
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}

const minFormControlsInFormRecord =
  (min: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const c = control as FormRecord;
    if (Object.keys(c.controls).length < min) {
      return { minFormControlsInFormRecord: true };
    }
    return null;
  };
