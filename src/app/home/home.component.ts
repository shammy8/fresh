import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { Observable, of, switchMap } from 'rxjs';

import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  limit,
  query,
} from '@angular/fire/firestore';

import { AddItemComponent } from '../add-item/add-item.component';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { Item } from '../item.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'fresh-home',
  template: `
    <button mat-fab color="primary" (click)="displayAddItemBottomSheet()">
      <mat-icon>add</mat-icon>
    </button>
    <fresh-item
      *ngFor="let item of items$ | async"
      [item]="item"
      (edit)="openEditItem(item)"
      (delete)="deleteItem(item)"
    ></fresh-item>
  `,
  styles: [
    `
      [mat-fab] {
        position: fixed;
        bottom: 20px;
        right: 20px;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  items$: Observable<any> = of([]); // TODO
  homeId = '';

  constructor(
    private _route: ActivatedRoute,
    private _firestore: Firestore,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.items$ = this._route.paramMap.pipe(
      switchMap((params) => {
        this.homeId = params.get('homeId') ?? '';
        const itemsQuery = query(
          collection(this._firestore, `home/${this.homeId}/items`),
          limit(10)
        );
        return collectionData(itemsQuery, { idField: 'id' });
      })
    );
  }

  displayAddItemBottomSheet() {
    const displayAddItemBottomSheet = this._bottomSheet.open(AddItemComponent, {
      data: { homeId: this.homeId },
    });
  }

  openEditItem(item: Item) {
    const displayEditItemBottomSheet = this._bottomSheet.open(
      EditItemComponent,
      {
        data: { homeId: this.homeId, item },
      }
    );
  }

  async deleteItem(item: Item) {
    if (confirm(`Are you sure you want to delete ${item.name}?`) === true) {
      await deleteDoc(
        doc(this._firestore, `home/${this.homeId}/items/${item.id}`)
      );

      this._snackBar.open('Successfully Deleted Item', 'Close');
      // TODO handle error
    }
  }
}
