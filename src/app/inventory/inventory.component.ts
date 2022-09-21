import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { auditTime, catchError, map, take } from 'rxjs/operators';

// import { LetModule } from '@rx-angular/template/let';
// import { ForModule } from '@rx-angular/template/for';

import {
  collection,
  collectionData,
  Firestore,
  limit,
  query,
  orderBy,
  where,
} from '@angular/fire/firestore';

import { AddItemComponent } from '../add-item/add-item.component';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { Item, ItemDto } from '../item.interface';
import { ItemService } from '../services/item.service';
import { QueryItemsComponent } from '../query-items/query-items.component';
import { HomeService } from '../services/home.service';
import { QueryItems } from '../query-items/query-item';
import { ItemComponent } from '../item/item.component';

@Component({
  standalone: true,
  imports: [
    // LetModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    ItemComponent,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    // ForModule,
    // IfModule,
  ],
  selector: 'fresh-inventory',
  template: `
    <!-- TODO rxSuspense is throwing an error -->
    <!-- <ng-container *rxLet="items$ as items; rxSuspense: loadingTemplate"> -->
    <ng-container *ngIf="(items$ | async) as items">
      <ng-container *ngIf="items.length > 0; else noItems">
        <fresh-item
          *ngFor="let item of items; trackBy: itemTrackByFn"
          [item]="item"
          [today]="todayDate"
          (edit)="openEditItemBottomSheet(item)"
          (delete)="deleteItem(item)"
          (deleteAndAddToShoppingList)="deleteAndAddToShoppingList(item)"
        ></fresh-item>
      </ng-container>

      <button
        class="load-more-button"
        mat-button
        (click)="loadMoreItems()"
        [disabled]="items.length < itemLimit"
      >
        Load more
      </button>
    </ng-container>

    <div class="add-empty-height"></div>

    <ng-template #noItems>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> No items found </mat-panel-title>
        </mat-expansion-panel-header>
        Please add an item or change your search criteria in the bottom right
      </mat-expansion-panel>
    </ng-template>

    <ng-template #loadingTemplate>
      <mat-spinner [diameter]="50"> </mat-spinner>
    </ng-template>

    <button
      mat-mini-fab
      class="query-button"
      (click)="openQueryItemsBottomSheet()"
    >
      <mat-icon>search</mat-icon>
    </button>
    <button
      mat-fab
      color="primary"
      class="add-item-button"
      (click)="openAddItemBottomSheet()"
    >
      <mat-icon>add</mat-icon>
    </button>
  `,
  styles: [
    `
      .load-more-button {
        display: block;
        margin: 0 auto;
      }
      .add-item-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 100;
      }
      .query-button {
        position: fixed;
        bottom: 85px;
        right: 30px;
        z-index: 100;
      }
      mat-expansion-panel {
        margin: 5px 0;
      }
      .add-empty-height {
        height: 120px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryComponent {
  /**
   * Today's date as a number set to a time of 00:00
   */
  todayDate = new Date().setHours(0, 0, 0, 0);

  private readonly _initialItemLimit = 30;
  itemLimit: number = this._initialItemLimit;
  private readonly _itemLimit$ = new BehaviorSubject<number>(this.itemLimit);

  items$ = combineLatest([
    this._route.paramMap,
    this._route.queryParamMap,
  ]).pipe(
    auditTime(0), // when both observables in the combineLatest emits a value at the same time this wil cause just one event to emit
    switchMap(([params, queryParamMap]) => {
      this.itemLimit = this._initialItemLimit;
      this._itemLimit$.next(this.itemLimit);

      return this._itemLimit$.pipe(
        switchMap((limitCount) => {
          this.homeId = params.get('homeId') ?? '';
          const queryItems = new QueryItems(queryParamMap);

          console.log(queryItems, limitCount);

          const queryCondition =
            queryItems.storedIn !== ''
              ? [where('storedIn', '==', queryItems.storedIn)]
              : [];

          // can't use where('storedIn', ....) then orderBy('storedIn')
          const orderByCondition =
            queryItems.storedIn !== '' && queryItems.sortBy === 'storedIn'
              ? []
              : [orderBy(queryItems.sortBy, queryItems.sortOrder)];

          const itemsQuery = query(
            collection(this._firestore, `homes/${this.homeId}/items`),
            ...queryCondition,
            ...orderByCondition,
            limit(limitCount)
          );

          // TODO is the below casting the best way to do this?
          return (
            collectionData(itemsQuery, {
              idField: 'id',
            }) as unknown as Observable<ItemDto>
          ).pipe(
            catchError(() => {
              alert(
                `This home doesn't exist or you are not authorised to access this home. Please check the URL is correct or that owner has given you accessed.`
              );
              this._router.navigate(['']);
              return of([]);
            })
          ) as Observable<ItemDto[]>;
        })
      );
    }),
    map((items) => items.map((item) => this._itemService.fromDto(item)))
    // TODO maybe just need to use fromDto when opening edit component
    // this will save some cpu
  );

  homeId = '';

  itemTrackByFn: TrackByFunction<Item> = (index: number, item: Item) => item.id;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _firestore: Firestore,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private _homeService: HomeService,
    private _itemService: ItemService
  ) {}

  loadMoreItems() {
    this.itemLimit += this._initialItemLimit;
    this._itemLimit$.next(this.itemLimit);
  }

  openQueryItemsBottomSheet() {
    let currentQuery = new QueryItems();
    this._route.queryParamMap.pipe(take(1)).subscribe((queryParams) => {
      currentQuery = new QueryItems(queryParams);
    });

    const bottomSheetRef = this._bottomSheet.open(QueryItemsComponent, {
      data: {
        currentQuery,
        storedInOptions$: this._homeService.getCurrentStorageFromHomes$(
          this.homeId
        ),
      },
    });
    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((data: QueryItems) => {
        if (!data) return;
        this._router.navigate([], {
          queryParams: data,
          relativeTo: this._route,
          queryParamsHandling: 'merge',
        });
      });
  }

  openAddItemBottomSheet() {
    const bottomSheetRef = this._bottomSheet.open(AddItemComponent, {
      data: {
        homeId: this.homeId,
        storedInOptions$: this._homeService.getCurrentStorageFromHomes$(
          this.homeId
        ),
      },
    });
  }

  openEditItemBottomSheet(item: Item) {
    const bottomSheetRef = this._bottomSheet.open(EditItemComponent, {
      data: {
        homeId: this.homeId,
        item,
        storedInOptions$: this._homeService.getCurrentStorageFromHomes$(
          this.homeId
        ),
      },
    });
  }

  async deleteItem(item: Item) {
    if (confirm(`Are you sure you want to delete ${item.name}?`) === false)
      return;

    try {
      await this._itemService.deleteItem(this.homeId, item.id!);
      this._snackBar.open('Successfully Deleted Item', 'Close');
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Deleting Item', 'Close');
    }
  }

  async deleteAndAddToShoppingList(item: Item) {
    try {
      await this._homeService.addItemToToBuyShoppingList(
        this.homeId,
        item.name
      );
      this._snackBar.open('Successfully Added Item to Shopping List', 'Close');
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error Adding Item to Shopping List', 'Close');
    }
  }
}
