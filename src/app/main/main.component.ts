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
import { Observable, of } from 'rxjs';
import { Home } from '../item.interface';

@Component({
  selector: 'fresh-main',
  template: `
    <mat-toolbar color="primary">
      <mat-icon (click)="matSidenav.toggle()">menu</mat-icon>
      <h1>Fresh</h1>
    </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav #matSidenav="matSidenav" mode="over">
        <mat-nav-list>
          <a
            mat-list-item
            *ngFor="let home of homes$ | async"
            [routerLink]="home.id"
            routerLinkActive="active-link" 
            (click)="matSidenav.close()"
          >
          <!-- TODO add a class (routerLinkActive) or symbol to show the chosen home -->
            {{ home.name }}
          </a>
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
    `,
  ],
})
export class MainComponent implements OnInit {
  homes$: Observable<Home[]> = of([]);

  constructor(private _auth: Auth, private _firestore: Firestore) {}

  ngOnInit(): void {
    const userId = this._auth.currentUser?.uid;
    if (userId) {
      const homesForUserQuery = query(
        collection(this._firestore, 'home'),
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
}
