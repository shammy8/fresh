import { Component, OnInit } from '@angular/core';

import { Auth } from '@angular/fire/auth';
import {
  collection,
  collectionData,
  DocumentData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Home } from '../item.interface';

@Component({
  selector: 'fresh-main',
  template: `
    <mat-toolbar color="primary">
      <mat-icon (click)="matSidenav.toggle()">menu</mat-icon>
      <h1>Fresh</h1>
      <mat-icon class="logout-button" (click)="logout()">logout</mat-icon>
    </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav #matSidenav="matSidenav" mode="over">
        <mat-nav-list>
          <mat-list-item *ngFor="let home of homes$ | async">
            <a
              mat-list-item
              [routerLink]="home.id"
              routerLinkActive
              #rla="routerLinkActive"
              (click)="matSidenav.close()"
            >
              {{ home.name }}
            </a>
            <mat-icon *ngIf="rla.isActive">checkbox</mat-icon>
          </mat-list-item>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      h1 {
        margin-left: 10px;
      }
      mat-sidenav-container {
        height: calc(100% - 64px);
      }
      mat-sidenav {
        width: 200px;
      }
      mat-sidenav-content {
        padding: 0px 5px;
      }
      .logout-button {
        margin-left: auto;
        cursor: pointer;
      }
    `,
  ],
})
export class MainComponent implements OnInit {
  homes$: Observable<Home[]> = of([]);

  constructor(
    private _router: Router,
    private _auth: Auth,
    private _firestore: Firestore
  ) {}

  ngOnInit(): void {
    const userId = this._auth.currentUser?.uid;
    if (userId) {
      const homesForUserQuery = query(
        collection(this._firestore, 'homes'),
        where(`users.${userId}`, '==', true)
      );
      //   getDocs(homesForUserQuery).then((homesSnapshot) =>
      //     homesSnapshot.forEach((data) => {
      //       console.log(data.data());
      //     })
      //   );
      // TODO is below type casting correct
      this.homes$ = collectionData(homesForUserQuery, {
        idField: 'id',
      }) as Observable<Home[]>;
    }
  }

  logout() {
    this._auth.signOut().then(() => {
      this._router.navigate(['login']);
    });
  }
}
