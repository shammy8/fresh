import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';

import { Auth, authState } from '@angular/fire/auth';

import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { Home } from '../item.interface';
import { HomeService } from '../services/home.service';
import { CloudNotificationService } from '../services/cloud-notification.service';
import { AddHomeComponent } from '../add-home/add-home.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { UserComponent } from '../user/user.component';
import { UserService } from '../services/user.service';

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
      .more-button {
        margin-left: auto;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnDestroy {
  @ViewChild(MatSidenav) matSideNav: MatSidenav | null = null;

  homes$: Observable<Home[]> = this._homeService.fetchHomes();

  userDoc$ = this._userService.userDoc$;

  private _cloudMessage$ = this._cloudNotificationService.cloudMessage$;

  private _userId = '';

  private _destroy = new Subject<void>();

  constructor(
    private _router: Router,
    private _auth: Auth,
    private _snackBar: MatSnackBar,
    private _homeService: HomeService,
    private _userService: UserService,
    private _cloudNotificationService: CloudNotificationService,
    private _bottomSheet: MatBottomSheet
  ) {
    this._cloudMessage$.pipe(takeUntil(this._destroy)).subscribe((payload) => {
      console.log(payload);
      if (payload.notification?.body) {
        this._snackBar.open(payload.notification.body);
      }
    });

    this._userService
      .fetchUserDoc()
      .pipe(takeUntil(this._destroy))
      .subscribe();
  }

  requestPermissionToSendNotifications() {
    Notification.requestPermission();
  }

  openBottomSheetToAddHome() {
    const bottomSheetRef = this._bottomSheet.open(AddHomeComponent, {
      data: { userDoc$: this.userDoc$ },
    });
    bottomSheetRef.afterDismissed().subscribe((docId) => {
      if (!docId) return;
      this._router.navigate(['home', docId]);
      this.matSideNav?.close();
    });
  }

  openBottomSheetToManageUsers(home: Home) {
    const home$ = this._homeService.getCurrentHomeFromHome$(home.id!);
    const bottomSheetRef = this._bottomSheet.open(ManageUsersComponent, {
      data: { userId: this._userId, home$ },
    });
  }

  openBottomSheetToUserPage() {
    const bottomSheetRef = this._bottomSheet.open(UserComponent, {
      data: { userId: this._userId },
    });
  }

  async deleteHome(home: Home) {
    if (!confirm(`Are you sure you want to delete ${home.name}?`)) return;

    try {
      await this._homeService.deleteHome(home);
      this._router.navigate(['']);
    } catch (error) {
      console.error(error);
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
    this._destroy.complete();
  }
}
