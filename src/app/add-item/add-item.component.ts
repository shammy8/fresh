import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import {
  arrayUnion,
  collection,
  doc,
  Firestore,
  serverTimestamp,
  writeBatch,
} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest, map, startWith, Subject, takeUntil } from 'rxjs';

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
export class AddItemComponent implements OnInit, OnDestroy {
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
    primaryDate: new FormControl({ value: null, disabled: true }),
    comments: new FormControl('', { nonNullable: true }),
  });

  filteredStoredInOptions$ = this.form.get('storedIn')?.valueChanges.pipe(
    startWith(''),
    map((value) => this._filter(value || ''))
  );

  disableSubmitButton = false;

  private _destroy = new Subject<void>();

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<AddItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private _data: { homeId: string; storedInOptions: string[] },
    private _firestore: Firestore
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.form.get('bestBefore')!.valueChanges.pipe(startWith(null)),
      this.form.get('useBy')!.valueChanges.pipe(startWith(null)),
      this.form.get('userDefinedDate')!.valueChanges.pipe(startWith(null)),
    ])
      .pipe(takeUntil(this._destroy))
      .subscribe(([bestBefore, useBy, userDefinedDate]) => {
        if (userDefinedDate) {
          this.form.get('primaryDate')?.patchValue(userDefinedDate);
          return;
        }
        if (!userDefinedDate && useBy) {
          this.form.get('primaryDate')?.patchValue(useBy);
          return;
        }
        if (!userDefinedDate && !useBy && bestBefore) {
          this.form.get('primaryDate')?.patchValue(bestBefore);
          return;
        }
        this.form.get('primaryDate')?.patchValue(null);
      });
  }

  // TODO move to item service
  async onAdd() {
    if (!this.form.valid) return;

    this.disableSubmitButton = true;
    const storedInValue = this.form.get('storedIn')!.value;

    const batch = writeBatch(this._firestore);

    if (!this._data.storedInOptions.includes(storedInValue)) {
      batch.update(doc(this._firestore, `homes/${this._data.homeId}`), {
        storage: arrayUnion(storedInValue),
      });
    }

    const newItemRef = doc(
      collection(this._firestore, `homes/${this._data.homeId}/items`)
    );
    batch.set(newItemRef, {
      ...this.form.getRawValue(),
      createdAt: serverTimestamp(),
    });

    try {
      await batch.commit();
      // this.form.reset();
      this._snackBar.open('Successfully Updated Item', 'Close');
      this.closeBottomSheet();
      // setTimeout(() => (this.disableSubmitButton = false), 3000); // stops user constantly adding items
    } catch (error) {
      console.error(error);
      this.disableSubmitButton = false;
      // TODO handle error
    }
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }

  ngOnDestroy(): void {
    this._destroy.next();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this._data.storedInOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
