import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

import { Auth } from '@angular/fire/auth';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Home } from '../item.interface';
import { HomeService } from '../services/home.service';
import { CloudNotificationService } from '../services/cloud-notification.service';
import { AddHomeComponent } from '../add-home/add-home.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { UserService } from '../services/user.service';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatBottomSheetModule,
  ],
  selector: 'fresh-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [CloudNotificationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnDestroy {
  @ViewChild(MatSidenav) matSideNav: MatSidenav | null = null;

  homes$ = this._homeService.homes$;

  userDoc$ = this._userService.userDoc$;

  private _cloudMessage$ = this._cloudNotificationService.cloudMessage$;

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

    this._homeService.fetchHomes().pipe(takeUntil(this._destroy)).subscribe();
    this._userService.fetchUserDoc().pipe(takeUntil(this._destroy)).subscribe();
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
    const home$ = this._homeService.getCurrentHomeFromHomes$(home.id!);
    const bottomSheetRef = this._bottomSheet.open(ManageUsersComponent, {
      data: { userDoc$: this.userDoc$, home$ },
    });
  }

  openBottomSheetToUserPage() {
    const bottomSheetRef = this._bottomSheet.open(UserProfileComponent, {
      data: { userDoc$: this.userDoc$ },
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
