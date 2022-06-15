import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { Observable, of, switchMap } from 'rxjs';

import {
  collection,
  collectionData,
  Firestore,
  limit,
  query,
} from '@angular/fire/firestore';
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'fresh-home',
  template: `
    <button mat-fab color="primary" (click)="displayAddItemBottomSheet()">
      <mat-icon>add</mat-icon>
    </button>
    <fresh-item *ngFor="let item of items$ | async" [item]="item"></fresh-item>
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
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.items$ = this._route.paramMap.pipe(
      switchMap((params) => {
        this.homeId = params.get('homeId') ?? '';
        const itemsQuery = query(
          collection(this._firestore, `home/${this.homeId}/items`),
          limit(10)
        );
        return collectionData(itemsQuery);
      })
    );
  }

  displayAddItemBottomSheet() {
    const displayAddItemBottomSheet = this._bottomSheet.open(AddItemComponent, {
      data: { homeId: this.homeId },
    });
  }
}
