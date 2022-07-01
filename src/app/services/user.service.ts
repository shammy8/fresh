import { Injectable } from '@angular/core';

import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';

import { BehaviorSubject, EMPTY, Observable, switchMap, tap } from 'rxjs';

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
        return docData(docRef) as Observable<UserDetails>; // TODO what if the user doc doesn't exist?
      }),
      tap((userDetails) => this._userDocBS$.next(userDetails))
    );
    // TODO handle errors
  }

  updateDisplayName(userId: string, displayName: string) {
    const userRef = doc(this._firestore, `users/${userId}`);
    return updateDoc(userRef, {
      displayName,
    });
  }
}
