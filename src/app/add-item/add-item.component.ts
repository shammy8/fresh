import { Component, Inject, OnInit } from '@angular/core';

import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'fresh-add-item',
  template: `
    <form [formGroup]="form" (ngSubmit)="onAdd()">
      <mat-form-field>
        <mat-label>Item</mat-label>
        <input matInput formControlName="name" placeholder="Chicken" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Stored In</mat-label>
        <input matInput formControlName="storedIn" placeholder="Fridge" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Date Bought</mat-label>
        <input
          matInput
          [matDatepicker]="dateBoughtPicker"
          formControlName="dateBought"
        />
        <mat-datepicker-toggle
          matSuffix
          [for]="dateBoughtPicker"
        ></mat-datepicker-toggle>
        <mat-datepicker #dateBoughtPicker></mat-datepicker>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Best Before</mat-label>
        <input
          matInput
          [matDatepicker]="bestBeforePicker"
          formControlName="bestBefore"
        />
        <mat-datepicker-toggle
          matSuffix
          [for]="bestBeforePicker"
        ></mat-datepicker-toggle>
        <mat-datepicker #bestBeforePicker></mat-datepicker>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Comments</mat-label>
        <textarea
          matInput
          formControlName="comments"
          placeholder="Move to freezer"
        ></textarea>
      </mat-form-field>
      <br />
      <button mat-button type="submit" [disabled]="disableSubmitButton">
        Add Item
      </button>
    </form>
  `,
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
    dateBought: new Date(),
    bestBefore: new Date(),
    storedIn: '',
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
