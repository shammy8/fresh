import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

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
    sortBy: new FormControl('', { nonNullable: true }),
    sortOrder: new FormControl('asc', { nonNullable: true }),
  });

  sortOptions = [
    { label: 'Chief Date', value: 'chiefDate' },
    { label: 'Best Before', value: 'bestBefore' },
    { label: 'Use By', value: 'useBy' },
    { label: 'User Defined Use By', value: 'userDefinedDate' },
  ];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<QueryItemsComponent>
  ) {}

  ngOnInit(): void {}

  onApply() {
    this._bottomSheetRef.dismiss(this.form.value);
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }
}

interface QueryItemsFormGroup {
  sortBy: FormControl<string>;
  sortOrder: FormControl<'asc' | 'desc'>;
}
