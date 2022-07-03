import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { GoogleAuthProvider } from 'firebase/auth';
import { Auth, signInWithPopup } from '@angular/fire/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'fresh-login',
  template: ` <mat-toolbar color="primary">
      <h1>Fresh</h1>
    </mat-toolbar>

    <br />
    <button mat-raised-button (click)="login()">Login with Google</button>`,
  styles: [
    `
      button {
        display: block;
        margin: 0 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  constructor(
    private _auth: Auth,
    private _router: Router,
    private _snackbar: MatSnackBar
  ) {}

  async login() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this._auth, provider);
      this._router.navigate(['']);
    } catch (error) {
      console.error(error);
      this._snackbar.open('Error Logging In', 'Close');
    }
  }
}
