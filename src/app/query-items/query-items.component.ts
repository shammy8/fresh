import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

import { Observable } from 'rxjs';

import { QueryItems, QueryItemsFormGroup } from '../item.interface';

@Component({
  selector: 'fresh-query-items',
  templateUrl: './query-items.component.html',
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
      }
      mat-radio-button {
        margin-right: 20px;
      }
      mat-divider {
        margin-bottom: 20px;
      }
      .button-container {
        display: flex;
        flex-direction: row-reverse;
      }
    `,
  ],
})
export class QueryItemsComponent implements OnInit {
  form = new FormGroup<QueryItemsFormGroup>({
    storedIn: new FormControl('', { nonNullable: true }),
    sortBy: new FormControl('createdAt', { nonNullable: true }),
    sortOrder: new FormControl('desc', { nonNullable: true }),
  });

  sortOptions = [
    { label: 'Order Added', value: 'createdAt' },
    { label: 'Primary Date', value: 'primaryDate' },
    { label: 'Best Before', value: 'bestBefore' },
    { label: 'Use By', value: 'useBy' },
    { label: 'User Defined Use By', value: 'userDefinedDate' },
    { label: 'Date Bought', value: 'dateBought' },
    { label: 'Stored In', value: 'storedIn' },
    { label: 'Name', value: 'name' },
  ];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<QueryItemsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: { currentQuery: QueryItems; storedInOptions$: Observable<string[]> }
  ) {}

  ngOnInit(): void {
    this.form.setValue(this.data.currentQuery);
  }

  onApply() {
    this._bottomSheetRef.dismiss(this.form.value);
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }
}
