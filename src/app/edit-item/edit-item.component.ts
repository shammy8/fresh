import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest, map, Subject, takeUntil } from 'rxjs';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Item, ItemFormGroup } from '../item.interface';
import { ItemService } from '../services/item.service';

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
export class EditItemComponent implements OnInit, OnDestroy {
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
    createdAt: new FormControl({ value: null, disabled: true }),
    comments: new FormControl('', { nonNullable: true }),
  });

  filteredStoredInOptions$ = this.form
    .get('storedIn')
    ?.valueChanges.pipe(map((value) => this._filter(value || '')));

  disableSubmitButton = false;

  private _destroy = new Subject<void>();

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<EditItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private _data: { homeId: string; item: Item; storedInOptions: string[] },
    private _itemService: ItemService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.form.get('bestBefore')!.valueChanges,
      this.form.get('useBy')!.valueChanges,
      this.form.get('userDefinedDate')!.valueChanges,
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

    this.form.patchValue(this._data.item);
  }

  async onUpdate() {
    if (!this.form.valid) return;

    this.disableSubmitButton = true;
    const storedInValue = this.form.get('storedIn')!.value;

    try {
      await this._itemService.updateItem(
        storedInValue,
        this._data.homeId,
        this._data.item.id!,
        this.form.getRawValue(),
        !this._data.storedInOptions.includes(storedInValue)
      );

      this._snackBar.open('Successfully Updated Item', 'Close');
      this.closeBottomSheet();
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Updating Item', 'Close');
      this.disableSubmitButton = false;
      // TODO handle error better
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
