import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { arrayUnion, doc, Firestore, updateDoc } from '@angular/fire/firestore';

import { combineLatest, map } from 'rxjs';

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
    dateBought: new FormControl(null, { updateOn: 'blur' }),
    bestBefore: new FormControl(null, { updateOn: 'blur' }),
    useBy: new FormControl(null, { updateOn: 'blur' }),
    userDefinedDate: new FormControl(null, { updateOn: 'blur' }),
    chiefDate: new FormControl({ value: null, disabled: true }),
    comments: new FormControl('', { nonNullable: true }),
  });

  filteredStoredInOptions$ = this.form
    .get('storedIn')
    ?.valueChanges.pipe(map((value) => this._filter(value || '')));

  disableSubmitButton = false;

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<EditItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private _data: { homeId: string; item: Item; storedInOptions: string[] },
    private _firestore: Firestore
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.form.get('bestBefore')!.valueChanges,
      this.form.get('useBy')!.valueChanges,
      this.form.get('userDefinedDate')!.valueChanges,
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

    this.form.patchValue(this._data.item);
  }

  async onUpdate() {
    if (!this.form.valid) return;

    this.disableSubmitButton = true;
    const storedInValue = this.form.get('storedIn')!.value;

    // TODO might be better to do a batch write for below two?
    if (!this._data.storedInOptions.includes(storedInValue)) {
      await updateDoc(doc(this._firestore, `homes/${this._data.homeId}`), {
        storage: arrayUnion(storedInValue),
      });
    }

    await updateDoc(
      doc(
        this._firestore,
        `homes/${this._data.homeId}/items/${this._data.item.id}`
      ),
      this.form.getRawValue()
    );

    this._snackBar.open('Successfully Updated Item', 'Close');
    this.closeBottomSheet();
    // TODO handle error
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this._data.storedInOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
