import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Auth } from '@angular/fire/auth';
import {
  getToken,
  MessagePayload,
  Messaging,
  onMessage,
} from '@angular/fire/messaging';

import { takeUntil, tap } from 'rxjs/operators';
import { EMPTY, from, Observable, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Home } from '../item.interface';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'fresh-main',
  template: `
    <mat-toolbar color="primary">
      <mat-icon (click)="matSidenav.toggle()">menu</mat-icon>
      <h1><a routerLink="">Fresh</a></h1>
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
        <!-- TODO put this request button somewhere else
        <button mat-button (click)="(request)">Request</button> -->
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      mat-icon,
      h1 {
        cursor: pointer;
      }
      h1 {
        margin-left: 10px;
        a {
          color: inherit;
          text-decoration: none;
        }
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
export class MainComponent implements OnInit, OnDestroy {
  homes$: Observable<Home[]> = this._homeService.fetchHomes();

  cloudMessage$: Observable<MessagePayload> = EMPTY;

  private _destroy = new Subject<void>();

  constructor(
    private _router: Router,
    private _auth: Auth,
    private _snackBar: MatSnackBar,
    private _homeService: HomeService,
    @Optional() private _fcm: Messaging
  ) {
    console.log('messaging', _fcm);
    if (_fcm) {
      from(
        navigator.serviceWorker
          .register('firebase-messaging-sw.js', { type: 'module', scope: '__' })
          .then((serviceWorkerRegistration) =>
            getToken(_fcm, {
              serviceWorkerRegistration,
              vapidKey: environment.vapidKey,
            })
          )
      )
        .pipe(
          tap((token) => console.log('FCM', { token })),
          takeUntil(this._destroy)
        )
        .subscribe();

      this.cloudMessage$ = new Observable((sub) =>
        onMessage(_fcm, (payload) => sub.next(payload))
      );
      this.cloudMessage$.pipe(takeUntil(this._destroy)).subscribe((payload) => {
        console.log(payload);
        if (payload.notification?.body) {
          this._snackBar.open(payload.notification.body);
        }
      });
    }
  }

  ngOnInit(): void {}

  request() {
    Notification.requestPermission();
  }

  logout() {
    if (!confirm('Are you sure you want to log out?')) return;
    this._auth.signOut().then(() => {
      this._router.navigate(['login']);
    });
  }

  ngOnDestroy() {
    this._destroy.next();
  }
}
