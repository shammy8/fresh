import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';

import { Auth } from '@angular/fire/auth';

import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { Home } from '../item.interface';
import { HomeService } from '../services/home.service';
import { CloudNotificationService } from '../services/cloud-notification.service';
import { AddHomeComponent } from '../add-home/add-home.component';

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
        <button
          class="add-home-button"
          mat-raised-button
          color="primary"
          (click)="addHome()"
        >
          <mat-icon>add</mat-icon>
          Home
        </button>
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
        <button mat-button (click)="requestPermissionToSendNotifications()">Request</button> -->
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
      .add-home-button {
        margin: 10px auto 0 auto;
        display: block;
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
  providers: [CloudNotificationService],
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) matSideNav: MatSidenav | null = null;

  homes$: Observable<Home[]> = this._homeService.fetchHomes();

  cloudMessage$ = this._cloudNotificationService.cloudMessage$;

  private _destroy = new Subject<void>();

  constructor(
    private _router: Router,
    private _auth: Auth,
    private _snackBar: MatSnackBar,
    private _homeService: HomeService,
    private _cloudNotificationService: CloudNotificationService,
    private _bottomSheet: MatBottomSheet
  ) {
    this.cloudMessage$.pipe(takeUntil(this._destroy)).subscribe((payload) => {
      console.log(payload);
      if (payload.notification?.body) {
        this._snackBar.open(payload.notification.body);
      }
    });
  }

  ngOnInit(): void {}

  requestPermissionToSendNotifications() {
    Notification.requestPermission();
  }

  addHome() {
    const bottomSheetRef = this._bottomSheet.open(AddHomeComponent);
    bottomSheetRef.afterDismissed().subscribe((docId) => {
      if (!docId) return;
      this._router.navigate([docId]);
      this.matSideNav?.close();
    });
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
