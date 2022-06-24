import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Auth, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { GoogleAuthProvider } from 'firebase/auth';

@Component({
  selector: 'fresh-login',
  template: ` <mat-toolbar color="primary">
      <h1>Fresh</h1>
    </mat-toolbar>

    <br />
    <button mat-raised-button color="primary" (click)="login()">
      Login with Google
    </button>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  constructor(private _auth: Auth, private _router: Router) {}

  ngOnInit(): void {}

  login() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this._auth, provider)
      .then(() => {
        this._router.navigate(['']);
      })
      .catch((error) => {
        // TODO
      });
  }
}
