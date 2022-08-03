import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs';

import { Item } from '../item.interface';
import { ItemService } from '../services/item.service';
import { HomeService } from '../services/home.service';
import {
  AddEditItemComponent,
  AddEditItemSubmit,
} from '../add-edit-item/add-edit-item.component';

@Component({
  standalone: true,
  imports: [AddEditItemComponent],
  selector: 'fresh-edit-item',
  template: `<fresh-add-edit-item
    submitButtonLabel="Update Item"
    [initialValues]="data.item"
    [storedInOptions$]="data.storedInOptions$"
    (closeBottomSheet)="closeBottomSheet()"
    (removeStorage)="removeStorage($event)"
    (submitForm)="onUpdate($event)"
  ></fresh-add-edit-item>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditItemComponent {
  constructor(
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<EditItemComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      homeId: string;
      item: Item;
      storedInOptions$: Observable<string[]>;
    },
    private _itemService: ItemService,
    private _homeService: HomeService
  ) {}

  async onUpdate({
    storedInValue,
    formRawValue,
    updateStorage,
  }: AddEditItemSubmit) {
    try {
      await this._itemService.updateItem(
        storedInValue,
        this.data.homeId,
        this.data.item.id!,
        formRawValue,
        updateStorage
      );

      this._snackBar.open('Successfully Updated Item', 'Close');
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Updating Item', 'Close');
    }
  }

  removeStorage(storage: string) {
    this._homeService.removeStorage(this.data.homeId, storage);
  }

  closeBottomSheet() {
    this._bottomSheetRef.dismiss();
  }
}
