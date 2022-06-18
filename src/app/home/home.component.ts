import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

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

    <ng-container *ngIf="items$ | async as items">
      <ng-container *ngIf="items.length > 0; else noItems">
        <fresh-item
          *ngFor="let item of items$ | async; trackBy: itemTrackByFn"
          [item]="item"
          (edit)="openEditItemBottomSheet(item)"
          (delete)="deleteItem(item)"
        ></fresh-item>
      </ng-container>
    </ng-container>

    <ng-template #noItems>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> No items found </mat-panel-title>
        </mat-expansion-panel-header>
        Please add an item or change your search criteria in the bottom right
      </mat-expansion-panel>
    </ng-template>
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
      mat-expansion-panel {
        margin: 5px 0;
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  query$ = new BehaviorSubject<QueryItems>({
    storedIn: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // TODO move to service
  items$ = combineLatest([this._route.paramMap, this.query$]).pipe(
    switchMap(([params, queryOptions]) => {
      this.homeId = params.get('homeId') ?? '';

      console.log(queryOptions);

      const queryCondition =
        queryOptions.storedIn !== ''
          ? [where('storedIn', '==', queryOptions.storedIn)]
          : [];

      // can't use where('storedIn', ....) then orderBy('storedIn')
      const orderByCondition =
        queryOptions.storedIn !== '' && queryOptions.sortBy === 'storedIn'
          ? []
          : [orderBy(queryOptions.sortBy, queryOptions.sortOrder)];

      const itemsQuery = query(
        collection(this._firestore, `homes/${this.homeId}/items`),
        ...queryCondition,
        ...orderByCondition,
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

  private _destroy = new Subject<void>();

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
    bottomSheetRef
      .afterDismissed()
      .pipe(takeUntil(this._destroy))
      .subscribe((data: QueryItems) => {
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

  ngOnDestroy(): void {
    this._destroy.next();
  }
}
