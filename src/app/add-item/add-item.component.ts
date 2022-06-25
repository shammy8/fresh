import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {
  combineLatest,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ItemFormGroup } from '../item.interface';
import { ItemService } from '../services/item.service';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'fresh-add-item',
  templateUrl: './add-item.component.html',
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
      }
      .storedIn-form-field {
        margin-bottom: 10px;
      }
      ::ng-deep .mat-option-text {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
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
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    storedIn: new FormControl('', {
      validators: [Validators.maxLength(30)],
      nonNullable: true,
    }),
    dateBought: new FormControl(new Date(), { updateOn: 'blur' }),
    bestBefore: new FormControl(null, { updateOn: 'blur' }),
    useBy: new FormControl(null, { updateOn: 'blur' }),
    userDefinedDate: new FormControl(null, { updateOn: 'blur' }),
    primaryDate: new FormControl({ value: null, disabled: true }),
    createdAt: new FormControl({ value: null, disabled: true }),
    comments: new FormControl('', {
      nonNullable: true,
      validators: Validators.maxLength(300),
    }),
  });

  filteredStoredInOptions$ = combineLatest([
    this.form.get('storedIn')!.valueChanges.pipe(startWith('')),
    this._data.storedInOptions$,
  ]).pipe(
    map(([value, storedInOptions]) =>
      this._filter(value || '', storedInOptions)
    )
  );

  disableSubmitButton = false;

  private _destroy = new Subject<void>();

  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<AddItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private _data: {
      homeId: string;
      storedInOptions$: Observable<string[]>;
    },
    private _itemService: ItemService,
    private _homeService: HomeService
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

  async onAdd() {
    if (!this.form.valid) return;

    this.disableSubmitButton = true;
    const storedInValue = this.form.get('storedIn')!.value;

    let storages: string[] = [];
    this._data.storedInOptions$.subscribe((storedIn) => (storages = storedIn));

    this.closeBottomSheet();

    try {
      await this._itemService.addItem(
        storedInValue,
        this._data.homeId,
        this.form.getRawValue(),
        !storages.includes(storedInValue)
      );

      this._snackBar.open('Successfully Added Item', 'Close');
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Adding Item', 'Close');
      this.disableSubmitButton = false;
      // TODO handle error better
    }
  }

  removeStorage(event: MouseEvent, storage: string) {
    event.stopPropagation();
    if (
      confirm(`Are you sure you want to remove this storage?
Removing will just remove it from the list. All items under this storage will continue to have it as the Stored In value.
If you go into another item and edit it without changing the Stored In value the stored in will then be added back into the list.`)
    ) {
      this._homeService.removeStorage(this._data.homeId, storage);
    }
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }

  ngOnDestroy(): void {
    this._destroy.next();
  }

  private _filter(value: string, storedInOptions: string[]): string[] {
    const filterValue = value.toLowerCase();
    return storedInOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
