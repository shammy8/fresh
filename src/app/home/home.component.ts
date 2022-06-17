import { Component, OnInit, TrackByFunction } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  limit,
  query,
  orderBy,
  where,
} from '@angular/fire/firestore';

import { AddItemComponent } from '../add-item/add-item.component';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { Item, ItemDto, QueryItems } from '../item.interface';
import { ItemService } from '../services/item.service';
import { QueryItemsComponent } from '../query-items/query-items.component';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'fresh-home',
  template: `
    <button
      mat-fab
      color="primary"
      class="add-item-button"
      (click)="openAddItemBottomSheet()"
    >
      <mat-icon>add</mat-icon>
    </button>
    <button
      mat-mini-fab
      class="query-button"
      (click)="openQueryItemsBottomSheet()"
    >
      <mat-icon>search</mat-icon>
    </button>
    <fresh-item
      *ngFor="let item of items$ | async; trackBy: itemTrackByFn"
      [item]="item"
      (edit)="openEditItemBottomSheet(item)"
      (delete)="deleteItem(item)"
    ></fresh-item>
  `,
  styles: [
    `
      .add-item-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
      }
      .query-button {
        position: fixed;
        bottom: 85px;
        right: 30px;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  query$ = new BehaviorSubject<QueryItems>({
    name: '',
    storedIn: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // TODO move to service
  items$ = combineLatest([this._route.paramMap, this.query$]).pipe(
    switchMap(([params, queryOptions]) => {
      this.homeId = params.get('homeId') ?? '';

      console.log(queryOptions);

      const queryCondition =
        queryOptions.name !== ''
          ? [where('name', '==', queryOptions.name)]
          : [];

      const queryCondition2 =
        queryOptions.storedIn.length > 0
          ? [where('storedIn', 'in', queryOptions.storedIn)] // TODO this only allows 10 elements in the array
          : [];

      const itemsQuery = query(
        collection(this._firestore, `homes/${this.homeId}/items`),
        ...queryCondition,
        ...queryCondition2,
        orderBy(queryOptions.sortBy, queryOptions.sortOrder),
        limit(50)
      );

      return collectionData(itemsQuery, { idField: 'id' }) as Observable<
        ItemDto[]
      >;
    }),
    map((items) => items.map((item) => this._itemService.fromDto(item)))
  );

  homeId = '';

  itemTrackByFn: TrackByFunction<Item> = (index: number, item: Item) => item.id;

  constructor(
    private _route: ActivatedRoute,
    private _firestore: Firestore,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private _homeService: HomeService,
    private _itemService: ItemService
  ) {}

  ngOnInit(): void {}

  openQueryItemsBottomSheet() {
    const bottomSheetRef = this._bottomSheet.open(QueryItemsComponent, {
      data: {
        currentQuery: this.query$.getValue(),
        storedInOptions: this._homeService.getStorageFromHome(this.homeId),
      },
    });
    // TODO unsubscribe
    bottomSheetRef.afterDismissed().subscribe((data: QueryItems) => {
      if (!data) return;
      this.query$.next(data);
    });
  }

  openAddItemBottomSheet() {
    const bottomSheetRef = this._bottomSheet.open(AddItemComponent, {
      data: {
        homeId: this.homeId,
        storedInOptions: this._homeService.getStorageFromHome(this.homeId),
      },
    });
  }

  openEditItemBottomSheet(item: Item) {
    const bottomSheetRef = this._bottomSheet.open(EditItemComponent, {
      data: {
        homeId: this.homeId,
        item,
        storedInOptions: this._homeService.getStorageFromHome(this.homeId),
      },
    });
  }

  async deleteItem(item: Item) {
    if (confirm(`Are you sure you want to delete ${item.name}?`) === false)
      return;

    await deleteDoc(
      doc(this._firestore, `homes/${this.homeId}/items/${item.id}`)
    );

    this._snackBar.open('Successfully Deleted Item', 'Close');
    // TODO handle error
  }
}
