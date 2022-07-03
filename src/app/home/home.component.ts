import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

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
import { Item, ItemDto, QueryItems } from '../item.interface';
import { ItemService } from '../services/item.service';
import { QueryItemsComponent } from '../query-items/query-items.component';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'fresh-home',
  template: `
    <ng-container *ngrxLet="items$ as items">
      <ng-container *ngIf="items.length > 0; else noItems">
        <fresh-item
          *ngFor="let item of items; trackBy: itemTrackByFn"
          [item]="item"
          (edit)="openEditItemBottomSheet(item)"
          (delete)="deleteItem(item)"
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

      <div class="add-empty-height"></div>

      <ng-template #noItems>
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title> No items found </mat-panel-title>
          </mat-expansion-panel-header>
          Please add an item or change your search criteria in the bottom right
        </mat-expansion-panel>
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
    </ng-container>
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
export class HomeComponent {
  private readonly _query$ = new BehaviorSubject<QueryItems>({
    storedIn: '',
    sortBy: 'primaryDate',
    sortOrder: 'asc',
  });

  private readonly _initialItemLimit = 30;
  itemLimit: number = this._initialItemLimit;
  private readonly _itemLimit$ = new BehaviorSubject<number>(this.itemLimit);

  items$ = combineLatest([this._route.paramMap, this._query$]).pipe(
    switchMap(([params, queryOptions]) => {
      this.itemLimit = this._initialItemLimit;
      this._itemLimit$.next(this.itemLimit);

      return this._itemLimit$.pipe(
        switchMap((limitCount) => {
          this.homeId = params.get('homeId') ?? '';

          console.log(queryOptions, limitCount);

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
    const bottomSheetRef = this._bottomSheet.open(QueryItemsComponent, {
      data: {
        currentQuery: this._query$.getValue(),
        storedInOptions$: this._homeService.getCurrentStorageFromHome$(
          this.homeId
        ),
      },
    });
    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((data: QueryItems) => {
        if (!data) return;
        this._query$.next(data);
      });
  }

  openAddItemBottomSheet() {
    const bottomSheetRef = this._bottomSheet.open(AddItemComponent, {
      data: {
        homeId: this.homeId,
        storedInOptions$: this._homeService.getCurrentStorageFromHome$(
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
        storedInOptions$: this._homeService.getCurrentStorageFromHome$(
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
}
