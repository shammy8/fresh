import { Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

import { doc, Firestore, updateDoc } from '@angular/fire/firestore';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Item } from '../item.interface';

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
  form = this._fb.group({
    name: ['', Validators.required],
    storedIn: '',
    dateBought: null as Date | null,
    bestBefore: null as Date | null,
    useBy: null as Date | null,
    userDefinedDate: null as Date | null,
    comments: '',
  });

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<EditItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private _data: { homeId: string; item: Item },
    private _fb: NonNullableFormBuilder,
    private _firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.form.patchValue(this._changeTimeStampsToDate(this._data.item) as any);
  }

  async onUpdate() {
    if (!this.form.valid) return;

    await updateDoc(
      doc(
        this._firestore,
        `home/${this._data.homeId}/items/${this._data.item.id}`
      ),
      this.form.value // TODO remove empty formControls??
    );

    this._snackBar.open('Successfully Updated Item', 'Close');
    this.closeBottomSheet()
    // TODO handle error
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }

  // TODO make a service to change date timestamps to and from js date?
  private _changeTimeStampsToDate(item: Item) {
    return {
      ...item,
      dateBought: item.dateBought?.toDate() ?? null,
      userDefinedDate: item.userDefinedDate?.toDate() ?? null,
      useBy: item.useBy?.toDate() ?? null,
      bestBefore: item.bestBefore?.toDate() ?? null,
    };
  }
}
