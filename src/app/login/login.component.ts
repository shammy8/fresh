import { Component, OnInit } from '@angular/core';
import { Auth, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { GoogleAuthProvider } from 'firebase/auth';

@Component({
  selector: 'fresh-login',
  template: ` <button mat-raised-button color="primary" (click)="login()">
    Login with Google
  </button>`,
  styles: [],
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
