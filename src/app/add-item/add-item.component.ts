import { Component, Inject, OnInit } from '@angular/core';

import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'fresh-add-item',
  templateUrl: './add-item.component.html',
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class AddItemComponent implements OnInit {
  form = this._fb.group({
    name: ['', Validators.required],
    storedIn: '',
    dateBought: null as Date | null,
    bestBefore: null as Date | null,
    useBy: null as Date | null,
    userDefinedDate: null as Date | null,
    comments: '',
  });

  disableSubmitButton = false;

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA) private _data: { homeId: string },
    private _fb: NonNullableFormBuilder,
    private _firestore: Firestore
  ) {}

  ngOnInit(): void {}

  async onAdd() {
    if (!this.form.valid) return;

    this.disableSubmitButton = true;
    await addDoc(
      collection(this._firestore, `home/${this._data.homeId}/items`),
      this.form.value // TODO remove empty formControls??
    );

    this.form.reset();
    this._snackBar.open('Successfully Added Item', 'Close');
    setTimeout(() => (this.disableSubmitButton = false), 3000); // stops user constantly adding items
    // TODO handle error
  }
}
