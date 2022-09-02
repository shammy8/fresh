import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { ForModule } from '@rx-angular/template/for';

import { Item, ItemFormGroup } from '../item.interface';
import { AutocompleteOnOffDirective } from '../directives/autocomplete-on-off.directive';

@Component({
  selector: 'fresh-add-edit-item',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    ForModule,
    // IfModule,
    AutocompleteOnOffDirective,
  ],
  templateUrl: './add-edit-item.component.html',
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
export class AddEditItemComponent implements OnInit, OnDestroy {
  @Input() initialValues: Item = {
    name: '',
    storedIn: '',
    dateBought: new Date(),
    primaryDate: null,
    userDefinedDate: null,
    useBy: null,
    bestBefore: null,
    notifyOn: null,
    createdAt: null,
    comments: '',
  };

  @Input() submitButtonLabel: string = 'Submit';

  @Input() storedInOptions$: Observable<string[]> = of([]);

  @Output() submitForm = new EventEmitter<AddEditItemSubmit>();

  @Output() removeStorage = new EventEmitter<string>();

  @Output() closeBottomSheet = new EventEmitter<void>();

  form: FormGroup<ItemFormGroup> | null = null;

  filteredStoredInOptions$: Observable<string[]> = of([]);

  disableSubmitButton = false;

  private _destroy = new Subject<void>();

  ngOnInit(): void {
    this.form = new FormGroup<ItemFormGroup>({
      name: new FormControl(this.initialValues.name, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      storedIn: new FormControl(this.initialValues.storedIn, {
        validators: [Validators.maxLength(30)],
        nonNullable: true,
      }),
      dateBought: new FormControl(
        { value: this.initialValues.dateBought, disabled: true },
        {
          updateOn: 'blur',
        }
      ),
      bestBefore: new FormControl(
        { value: this.initialValues.bestBefore, disabled: true },
        {
          updateOn: 'blur',
        }
      ),
      useBy: new FormControl(
        { value: this.initialValues.useBy, disabled: true },
        { updateOn: 'blur' }
      ),
      userDefinedDate: new FormControl(
        { value: this.initialValues.userDefinedDate, disabled: true },
        {
          updateOn: 'blur',
        }
      ),
      primaryDate: new FormControl({
        value: this.initialValues.primaryDate,
        disabled: true,
      }),
      createdAt: new FormControl({
        value: this.initialValues.createdAt,
        disabled: true,
      }),
      comments: new FormControl(this.initialValues.comments, {
        nonNullable: true,
        validators: Validators.maxLength(300),
      }),
    });

    this.filteredStoredInOptions$ = combineLatest([
      this.form.get('storedIn')!.valueChanges.pipe(startWith('')),
      this.storedInOptions$,
    ]).pipe(
      map(([value, storedInOptions]) => {
        return this._filter(value || '', storedInOptions);
      })
    );

    combineLatest([
      this.form
        .get('bestBefore')!
        .valueChanges.pipe(startWith(this.initialValues.bestBefore)),
      this.form
        .get('useBy')!
        .valueChanges.pipe(startWith(this.initialValues.useBy)),
      this.form
        .get('userDefinedDate')!
        .valueChanges.pipe(startWith(this.initialValues.userDefinedDate)),
    ])
      .pipe(takeUntil(this._destroy))
      .subscribe(([bestBefore, useBy, userDefinedDate]) => {
        if (userDefinedDate) {
          this.form?.get('primaryDate')?.patchValue(userDefinedDate);
          return;
        }
        if (!userDefinedDate && useBy) {
          this.form?.get('primaryDate')?.patchValue(useBy);
          return;
        }
        if (!userDefinedDate && !useBy && bestBefore) {
          this.form?.get('primaryDate')?.patchValue(bestBefore);
          return;
        }
        this.form?.get('primaryDate')?.patchValue(null);
      });
  }

  onSubmit() {
    if (!this.form?.valid) return;

    this.disableSubmitButton = true;
    const storedInValue = this.form.get('storedIn')!.value;

    let storages: string[] = [];
    this.storedInOptions$.subscribe((storedIn) => (storages = storedIn));

    this.closeBottomSheet.emit();

    this.submitForm.emit({
      storedInValue,
      formRawValue: this.form.getRawValue(),
      updateStorage: !storages.includes(storedInValue),
    });
  }

  onRemoveStorage(event: MouseEvent, storage: string) {
    event.stopPropagation();
    if (
      confirm(`Are you sure you want to remove this storage?
Removing will just remove it from the list. All items under this storage will continue to have it as the Stored In value.
If you go into another item and edit it without changing the Stored In value the stored in will then be added back into the list.`)
    ) {
      this.removeStorage.emit(storage);
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  private _filter(value: string, storedInOptions: string[]): string[] {
    const filterValue = value.toLowerCase();
    return storedInOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}

export interface AddEditItemSubmit {
  storedInValue: string;
  formRawValue: Item;
  updateStorage: boolean;
}
