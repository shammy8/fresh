import { Component, OnInit } from '@angular/core';

import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';

import { Home } from '../item.interface';
import { HomeService } from '../services/home.service';

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
      mat-icon {
        cursor: pointer;
      }
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
  homes$: Observable<Home[]> = this._homeService.fetchHomes();

  constructor(
    private _router: Router,
    private _auth: Auth,
    private _homeService: HomeService
  ) {}

  ngOnInit(): void {}

  logout() {
    if (!confirm('Are you sure you want to log out?')) return;
    this._auth.signOut().then(() => {
      this._router.navigate(['login']);
    });
  }
}
