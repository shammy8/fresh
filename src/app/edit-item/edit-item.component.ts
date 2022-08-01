import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  combineLatest,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ForModule } from '@rx-angular/template/experimental/for';
import { IfModule } from '@rx-angular/template/experimental/if';

import { Item, ItemFormGroup } from '../item.interface';
import { ItemService } from '../services/item.service';
import { HomeService } from '../services/home.service';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    IfModule,
    ForModule,
  ],
  selector: 'fresh-edit-item',
  templateUrl: './edit-item.component.html',
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
    `,
  ],
})
export class EditItemComponent implements OnInit, OnDestroy {
  form = new FormGroup<ItemFormGroup>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    storedIn: new FormControl('', {
      validators: [Validators.maxLength(30)],
      nonNullable: true,
    }),
    dateBought: new FormControl(null, { updateOn: 'blur' }),
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
    private _bottomSheetRef: MatBottomSheetRef<EditItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private _data: {
      homeId: string;
      item: Item;
      storedInOptions$: Observable<string[]>;
    },
    private _itemService: ItemService,
    private _homeService: HomeService
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

    let storages: string[] = [];
    this._data.storedInOptions$.subscribe((storedIn) => (storages = storedIn));

    this.closeBottomSheet();

    try {
      await this._itemService.updateItem(
        storedInValue,
        this._data.homeId,
        this._data.item.id!,
        this.form.getRawValue(),
        !storages.includes(storedInValue)
      );

      this._snackBar.open('Successfully Updated Item', 'Close');
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Updating Item', 'Close');
      this.disableSubmitButton = false;
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
