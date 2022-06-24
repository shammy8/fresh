import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HomeFormGroup } from '../item.interface';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'fresh-add-home',
  templateUrl: './add-home.component.html',
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
    storage: new FormControl([], {
      validators: [arrayElementMaxLength(30)],
      nonNullable: true,
    }),
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

/**
 * Validator that requires the length of each element of a string array to be less than or equal to the provided maximum length.
 *
 * @param maxLength
 * @returns
 */
const arrayElementMaxLength =
  (maxLength: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const value: string[] = control.value;
    if (!Array.isArray(value)) {
      console.error(
        'Form control value of arrayElementMaxLength must be an array of strings'
      );
      return null;
    }

    for (let i = 0; i < value.length; i++) {
      if (typeof value[i] !== 'string') {
        console.error(
          'Form control value of arrayElementMaxLength must be an array of strings'
        );
        return null;
      } else if (value[i].length > maxLength) {
        return { arrayElementMaxLength: true };
      }
    }

    return null;
  };
