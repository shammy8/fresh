import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs';

import { ItemService } from '../services/item.service';
import { HomeService } from '../services/home.service';
import {
  AddEditItemComponent,
  AddEditItemSubmit,
} from '../add-edit-item/add-edit-item.component';

@Component({
  standalone: true,
  imports: [AddEditItemComponent],
  selector: 'fresh-add-item',
  template: `<fresh-add-edit-item
    submitButtonLabel="Add Item"
    [storedInOptions$]="data.storedInOptions$"
    (closeBottomSheet)="closeBottomSheet()"
    (removeStorage)="removeStorage($event)"
    (submitForm)="onAdd($event)"
  ></fresh-add-edit-item>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddItemComponent {
  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<AddItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      homeId: string;
      storedInOptions$: Observable<string[]>;
    },
    private _itemService: ItemService,
    private _homeService: HomeService
  ) {}

  async onAdd({
    storedInValue,
    formRawValue,
    updateStorage,
  }: AddEditItemSubmit) {
    try {
      await this._itemService.addItem(
        storedInValue,
        this.data.homeId,
        formRawValue,
        updateStorage
      );

      this._snackBar.open('Successfully Added Item', 'Close');
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Adding Item', 'Close');
    }
  }

  removeStorage(storage: string) {
    this._homeService.removeStorage(this.data.homeId, storage);
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }
}
