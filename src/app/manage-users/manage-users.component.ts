import { Component, Inject, OnInit } from '@angular/core';

import { Auth, authState } from '@angular/fire/auth';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

import { Home } from '../item.interface';

// TODO not finished
@Component({
  selector: 'fresh-manage-users',
  template: `
    <div *ngFor="let user of data.home.users | keyvalue">
      <span>
        <ng-container *ngIf="user.key === userId">You </ng-container
        >{{ user.key }}</span
      >
    </div>
  `,
  styles: [],
})
export class ManageUsersComponent implements OnInit {
  userId = '';
  constructor(
    public auth: Auth,
    private _bottomSheetRef: MatBottomSheetRef<ManageUsersComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      home: Home;
    }
  ) {}

  ngOnInit(): void {
    authState(this.auth).subscribe((user) => {
      this.userId = user?.uid ?? '';
    });
    console.log(this.data.home);
  }
}
