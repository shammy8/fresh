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
import { ManageUsersComponent } from '../manage-users/manage-users.component';

@Component({
  selector: 'fresh-main',
  templateUrl: './main.component.html',
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
        width: 250px;
      }
      .add-home-button {
        margin: 10px auto 0 auto;
        display: block;
      }
      mat-nav-list {
        max-height: calc(100% - 80px);
        overflow-y: auto;
      }
      .mat-list-item {
        a {
          width: 180px;
          overflow-x: hidden;
        }
        mat-icon {
          margin-left: auto;
        }
      }
      mat-sidenav-content {
        padding: 0px 5px;
      }
      .logout-button {
        margin-left: auto;
        cursor: pointer;
      }
      ::ng-deep .mat-drawer-inner-container {
        display: flex;
        flex-direction: column;
      }
      .version-number {
        margin: auto auto 0 auto;
        font-size: 12px;
        opacity: 0.6;
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

  openBottomSheetToManageUsers(home: Home) {
    const bottomSheetRef = this._bottomSheet.open(ManageUsersComponent, {
      data: { home },
    });
  }

  deleteHome(home: Home) {
    if (confirm(`Are you sure you want to delete this ${home.name}?`)) {
      alert('This feature is not implemented yet');
    }
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
