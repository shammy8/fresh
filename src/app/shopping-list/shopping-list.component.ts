import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

// import { ForModule } from '@rx-angular/template/for';

import { HomeService } from '../services/home.service';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatCheckboxModule,
    // ForModule,
    // IfModule,
  ],
  selector: 'fresh-shopping-list',
  template: `
    <div class="add-item-container">
      <div></div>
      <mat-icon (click)="addItemToToBuy()">add</mat-icon>
      <form [formGroup]="addForm" (ngSubmit)="addItemToToBuy()">
        <input
          type="text"
          matInput
          placeholder="Add Item"
          formControlName="newItem"
          [matAutocomplete]="addItemAuto"
        />
        <mat-autocomplete
          autoActiveFirstOption
          #addItemAuto="matAutocomplete"
          (optionSelected)="autocompletedSelected($event)"
        >
          <mat-option
            *ngFor="let option of filteredBought$ | async"
            [value]="option"
          >
            <mat-checkbox disabled checked> </mat-checkbox>
            &nbsp; {{ option }}
          </mat-option>
        </mat-autocomplete>
      </form>
    </div>

    <ul cdkDropList (cdkDropListDropped)="toBuyDrop($event)">
      <li *ngFor="let item of toBuy; index as i" cdkDrag>
        <mat-icon cdkDragHandle>drag_indicator</mat-icon>
        <mat-checkbox (change)="moveToBought(item)"> </mat-checkbox>
        <input
          matInput
          [ngModel]="toBuy[i]"
          [ngModelOptions]="{ updateOn: 'blur' }"
          (ngModelChange)="updateToBuyItem($event, i)"
        />
        <mat-icon (click)="deleteItemFromToBuy(i)" class="clear-button"
          >clear</mat-icon
        >
      </li>
    </ul>

    <mat-divider *ngIf="bought.length > 0"> </mat-divider>

    <ul cdkDropList (cdkDropListDropped)="boughtDrop($event)">
      <li *ngFor="let item of bought; index as i" cdkDrag>
        <mat-icon cdkDragHandle>drag_indicator</mat-icon>
        <mat-checkbox (change)="moveToToBuy(item)" [checked]="true">
        </mat-checkbox>
        <input
          matInput
          [ngModel]="bought[i]"
          [ngModelOptions]="{ updateOn: 'blur' }"
          (ngModelChange)="updateBoughtItem($event, i)"
        />
        <mat-icon (click)="deleteItemFromBought(i)" class="clear-button"
          >clear</mat-icon
        >
      </li>
    </ul>
  `,
  styles: [
    `
      ul {
        display: grid;
        row-gap: 10px;
        list-style: none;
        padding-left: 0;
      }
      .add-item-container {
        margin: 10px 0;
      }
      .add-item-container,
      li {
        display: grid;
        grid-template-columns: 50px 30px auto 30px;
      }
      mat-icon[cdkDragHandle] {
        cursor: move;
      }
      mat-icon {
        cursor: pointer;
      }
      input {
        border: none;
        background: #303030;
        color: white;
        width: 100%;
      }
      input:focus {
        outline: none;
      }
      .clear-button {
        font-size: 18px;
      }
      /* Animate items as they're being sorted. */
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      /* Animate an item that has been dropped. Moves dropped item to new position */
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
      /* The item placeholder in the original position while the item is being dragged*/
      .cdk-drag-placeholder {
        opacity: 0;
      }
    `,
  ],
})
export class ShoppingListComponent implements OnDestroy {
  homeId = '';

  toBuy: string[] = [];
  bought: string[] = [];

  addForm = new FormGroup<{ newItem: FormControl<string> }>({
    newItem: new FormControl('', {
      nonNullable: true,
    }),
  });

  private readonly _destroy = new Subject<void>();

  filteredBought$ = this.addForm.valueChanges.pipe(
    takeUntil(this._destroy),
    map((value) => this._filter(value.newItem || '', this.bought))
  );

  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private readonly _route: ActivatedRoute,
    private readonly _homeService: HomeService
  ) {
    this._route.paramMap
      .pipe(
        switchMap((paramMap) => {
          this.homeId = paramMap.get('homeId') ?? '';
          return this._homeService.getCurrentHomeFromHomes$(this.homeId);
        }),
        takeUntil(this._destroy)
      )
      .subscribe((home) => {
        this.toBuy = home?.shoppingList?.toBuy ?? [];
        this.bought = home?.shoppingList?.bought ?? [];
        this._cdr.markForCheck();
      });
  }

  autocompletedSelected(item: MatAutocompleteSelectedEvent) {
    this.moveToToBuy(item.option.value);
    this.addForm.reset();
  }

  addItemToToBuy() {
    if (!this.addForm.value.newItem) return;

    const newToBuy = [this.addForm.value.newItem, ...this.toBuy];
    this.addForm.reset();
    this._homeService.updateShoppingList(this.homeId, {
      toBuy: newToBuy,
      bought: this.bought,
    });
    // TODO error handling for this and others?
  }

  moveToBought(itemToMove: string) {
    const newToBuy = this.toBuy.filter((item) => itemToMove !== item);
    const newBought = [itemToMove, ...this.bought];
    this._homeService.updateShoppingList(this.homeId, {
      toBuy: newToBuy,
      bought: newBought,
    });
  }

  moveToToBuy(itemToMove: string) {
    const newToBuy = [...this.toBuy, itemToMove];
    const newBought = this.bought.filter((item) => itemToMove !== item);
    this._homeService.updateShoppingList(this.homeId, {
      toBuy: newToBuy,
      bought: newBought,
    });
  }

  updateToBuyItem(newItemName: string, toBuyIndex: number) {
    const newToBuy = [...this.toBuy];
    newToBuy[toBuyIndex] = newItemName;

    this._homeService.updateShoppingList(this.homeId, {
      toBuy: newToBuy,
      bought: this.bought,
    });
  }

  updateBoughtItem(newItemName: string, boughtIndex: number) {
    const newBought = [...this.bought];
    newBought[boughtIndex] = newItemName;

    this._homeService.updateShoppingList(this.homeId, {
      toBuy: this.toBuy,
      bought: newBought,
    });
  }

  deleteItemFromToBuy(indexToDelete: number) {
    const newToBuy = this.toBuy.filter((_, index) => indexToDelete !== index);
    this._homeService.updateShoppingList(this.homeId, {
      toBuy: newToBuy,
      bought: this.bought,
    });
  }

  deleteItemFromBought(indexToDelete: number) {
    const newBought = this.bought.filter((_, index) => indexToDelete !== index);
    this._homeService.updateShoppingList(this.homeId, {
      toBuy: this.toBuy,
      bought: newBought,
    });
  }

  toBuyDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.toBuy, event.previousIndex, event.currentIndex);
    this._homeService.updateShoppingList(this.homeId, {
      toBuy: this.toBuy,
      bought: this.bought,
    });
  }

  boughtDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.bought, event.previousIndex, event.currentIndex);
    this._homeService.updateShoppingList(this.homeId, {
      toBuy: this.toBuy,
      bought: this.bought,
    });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  private _filter(value: string, storedInOptions: string[]): string[] {
    if (value.length < 2) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return storedInOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
