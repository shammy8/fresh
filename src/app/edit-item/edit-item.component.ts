import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { doc, Firestore, updateDoc } from '@angular/fire/firestore';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Item, ItemFormGroup } from '../item.interface';

@Component({
  selector: 'fresh-edit-item',
  templateUrl: './edit-item.component.html',
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
export class EditItemComponent implements OnInit {
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

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<EditItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private _data: { homeId: string; item: Item },
    private _firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.form.patchValue(this._data.item);
  }

  async onUpdate() {
    if (!this.form.valid) return;

    await updateDoc(
      doc(
        this._firestore,
        `homes/${this._data.homeId}/items/${this._data.item.id}`
      ),
      this.form.value
    );

    this._snackBar.open('Successfully Updated Item', 'Close');
    this.closeBottomSheet();
    // TODO handle error
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }
}
