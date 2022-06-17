import { Component, Inject, OnInit } from '@angular/core';

import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest, startWith } from 'rxjs';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ItemFormGroup } from '../item.interface';

@Component({
  selector: 'fresh-add-item',
  templateUrl: './add-item.component.html',
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
      }
      .button-container {
        display: flex;
        flex-direction: row-reverse;
      }
    `,
  ],
})
export class AddItemComponent implements OnInit {
  form = new FormGroup<ItemFormGroup>({
    name: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    storedIn: new FormControl('', { nonNullable: true }),
    dateBought: new FormControl(null, { updateOn: 'blur' }),
    bestBefore: new FormControl(null, { updateOn: 'blur' }),
    useBy: new FormControl(null, { updateOn: 'blur' }),
    userDefinedDate: new FormControl(null, { updateOn: 'blur' }),
    chiefDate: new FormControl({ value: null, disabled: true }),
    comments: new FormControl('', { nonNullable: true }),
  });

  disableSubmitButton = false;

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<AddItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private _data: { homeId: string },
    private _firestore: Firestore
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.form.get('bestBefore')!.valueChanges.pipe(startWith(null)),
      this.form.get('useBy')!.valueChanges.pipe(startWith(null)),
      this.form.get('userDefinedDate')!.valueChanges.pipe(startWith(null)),
    ]).subscribe(([bestBefore, useBy, userDefinedDate]) => {
      if (userDefinedDate) {
        this.form.get('chiefDate')?.patchValue(userDefinedDate);
        return;
      }
      if (!userDefinedDate && useBy) {
        this.form.get('chiefDate')?.patchValue(useBy);
        return;
      }
      if (!userDefinedDate && !useBy && bestBefore) {
        this.form.get('chiefDate')?.patchValue(bestBefore);
        return;
      }
      this.form.get('chiefDate')?.patchValue(null);
    });
  }

  async onAdd() {
    if (!this.form.valid) return;

    this.disableSubmitButton = true;
    await addDoc(
      collection(this._firestore, `homes/${this._data.homeId}/items`),
      this.form.getRawValue()
    );

    this.form.reset();
    this._snackBar.open('Successfully Added Item', 'Close');
    setTimeout(() => (this.disableSubmitButton = false), 3000); // stops user constantly adding items
    // TODO handle error
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }
}
