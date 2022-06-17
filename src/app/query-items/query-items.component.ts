import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

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
      .button-container {
        display: flex;
        flex-direction: row-reverse;
      }
    `,
  ],
})
export class QueryItemsComponent implements OnInit {
  form = new FormGroup<QueryItemsFormGroup>({
    sortBy: new FormControl('createdAt', { nonNullable: true }),
    sortOrder: new FormControl('desc', { nonNullable: true }),
  });

  sortOptions = [
    { label: 'Chief Date', value: 'chiefDate' },
    { label: 'Best Before', value: 'bestBefore' },
    { label: 'Use By', value: 'useBy' },
    { label: 'User Defined Use By', value: 'userDefinedDate' },
    { label: 'Order Added', value: 'createdAt' },
  ];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<QueryItemsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private _data: { currentQuery: QueryItems }
  ) {}

  ngOnInit(): void {
    this.form.setValue(this._data.currentQuery);
  }

  onApply() {
    this._bottomSheetRef.dismiss(this.form.value);
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }
}
