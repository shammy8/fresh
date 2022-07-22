import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

import { Observable } from 'rxjs';

import { QueryItemsFormGroup } from '../item.interface';
import { QueryItems, SortByOptions } from './query-item';

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
    sortBy: new FormControl(SortByOptions.PrimaryDate, { nonNullable: true }),
    sortOrder: new FormControl('asc', { nonNullable: true }),
  });

  sortOptions = [
    { label: 'Primary Expiration Date', value: SortByOptions.PrimaryDate },
    { label: 'Order Added to Fresh', value: SortByOptions.CreatedAt },
    { label: 'Stored In', value: SortByOptions.StoredIn },
    { label: 'Name', value: SortByOptions.Name },
    { label: 'Date Bought', value: SortByOptions.DateBought },
    { label: 'Best Before', value: SortByOptions.BestBefore },
    { label: 'Use By', value: SortByOptions.UseBy },
    { label: 'User Defined Use By', value: SortByOptions.UserDefinedDate },
  ];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<QueryItemsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      currentQuery: QueryItems;
      storedInOptions$: Observable<string[]>;
    }
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
