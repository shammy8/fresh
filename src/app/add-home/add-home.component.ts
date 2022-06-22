import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HomeFormGroup } from '../item.interface';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'fresh-add-home',
  template: `
    <form [formGroup]="form" (ngSubmit)="onAdd()">
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Users ID</mat-label>
        <mat-chip-list #usersList multiple formControlName="users">
          <mat-chip
            *ngFor="let uid of uidList"
            [selected]="uid"
            [value]="uid"
            (removed)="removeUid(uid)"
          >
            {{ uid }}
            <button matChipRemove>
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip>
        </mat-chip-list>
        <input
          [matChipInputFor]="usersList"
          (matChipInputTokenEnd)="addUid($event)"
        />
        <mat-hint align="end">Press enter after each one</mat-hint>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Storages</mat-label>
        <mat-chip-list #storagesList multiple formControlName="storage">
          <mat-chip
            *ngFor="let storage of storageList"
            [selected]="storage"
            [value]="storage"
            (removed)="removeStorage(storage)"
          >
            {{ storage }}
            <button matChipRemove>
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip>
        </mat-chip-list>
        <input
          [matChipInputFor]="storagesList"
          (matChipInputTokenEnd)="addStorage($event)"
        />
        <mat-hint align="end">Press enter after each one</mat-hint>
      </mat-form-field>

      <div class="button-container">
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="disableSubmitButton"
        >
          Add Home
        </button>
        <button mat-button type="button" (click)="closeBottomSheet()">
          Close
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
      }
      .button-container {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 10px;
      }
    `,
  ],
})
export class AddHomeComponent implements OnInit {
  form = new FormGroup<HomeFormGroup>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    users: new FormControl([], { nonNullable: true }),
    storage: new FormControl([], { nonNullable: true }),
  });

  uidList: Set<string> = new Set();
  storageList: Set<string> = new Set();

  disableSubmitButton = false;

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<AddHomeComponent>,
    private _homeService: HomeService
  ) {}

  ngOnInit(): void {}

  closeBottomSheet(docRef?: string) {
    this._bottomSheetRef.dismiss(docRef);
  }

  addUid(event: MatChipInputEvent) {
    if (!event.value) return;
    this.uidList.add(event.value);
    const newUsersValue = Array.from(this.uidList.values());
    this.form.get('users')?.patchValue(newUsersValue);
    event.chipInput!.clear();
  }

  removeUid(uid: string) {
    this.uidList.delete(uid);
    const newUsersValue = Array.from(this.uidList.values());
    this.form.get('users')?.patchValue(newUsersValue);
  }

  addStorage(event: MatChipInputEvent) {
    if (!event.value) return;
    this.storageList.add(event.value);
    const newUsersValue = Array.from(this.storageList.values());
    this.form.get('storage')?.patchValue(newUsersValue);
    event.chipInput!.clear();
  }

  removeStorage(storage: string) {
    this.storageList.delete(storage);
    const newUsersValue = Array.from(this.storageList.values());
    this.form.get('storage')?.patchValue(newUsersValue);
  }

  async onAdd() {
    if (!this.form.valid) return;

    this.disableSubmitButton = true;
    const usersMap = this._mapUsersArrayToObject(this.form.value.users);

    try {
      const docRef = await this._homeService.addHome({
        ...this.form.getRawValue(),
        users: usersMap,
      });
      this.closeBottomSheet(docRef.id);
      this._snackBar.open('Successfully Added Home', 'Close');
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Adding Home', 'Close');
      this.disableSubmitButton = false;
      // TODO better handle error
    }
  }

  private _mapUsersArrayToObject(users: string[] | undefined): {
    [key: string]: true;
  } {
    if (!users) return {};

    const usersMap: { [key: string]: true } = {};
    users.forEach((user) => (usersMap[user] = true));
    return usersMap;
  }
}
