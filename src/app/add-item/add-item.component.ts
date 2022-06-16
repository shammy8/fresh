import { Component, Inject, OnInit } from '@angular/core';

import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item, ItemFormGroup } from '../item.interface';

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
    dateBought: new FormControl(null),
    bestBefore: new FormControl(null),
    useBy: new FormControl(null),
    userDefinedDate: new FormControl(null),
    comments: new FormControl('', { nonNullable: true }),
  });

  disableSubmitButton = false;

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<AddItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private _data: { homeId: string },
    private _firestore: Firestore
  ) {}

  ngOnInit(): void {}

  async onAdd() {
    if (!this.form.valid) return;

    this.disableSubmitButton = true;
    await addDoc(
      collection(this._firestore, `homes/${this._data.homeId}/items`),
      this.form.value
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
