import { Injectable } from '@angular/core';

import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';

import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

import { UserDetails } from '../item.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userDocBS$ = new BehaviorSubject<UserDetails>({
    displayName: '',
    email: '',
    uid: '',
  });
  userDoc$ = this._userDocBS$.asObservable();

  constructor(private _auth: Auth, private _firestore: Firestore) {}

  fetchUserDoc() {
    return authState(this._auth).pipe(
      switchMap((user) => {
        if (!user) return EMPTY;

        const docRef = doc(this._firestore, `users/${user.uid}`);
        return (docData(docRef) as Observable<UserDetails | undefined>).pipe(
          catchError((error) => {
            console.error(error);
            return EMPTY;
          })
        );
      }),
      tap((userDetails) => {
        if (!userDetails) {
          console.error('User document does not exist');
          this._userDocBS$.next({ displayName: '', email: '', uid: '' });
        } else {
          this._userDocBS$.next(userDetails);
        }
      }),
    );
  }

  updateDisplayName(userId: string, displayName: string) {
    const userRef = doc(this._firestore, `users/${userId}`);
    return updateDoc(userRef, {
      displayName,
    });
  }
}
