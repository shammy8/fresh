import { Injectable } from '@angular/core';

import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';

import { EMPTY, Observable, switchMap } from 'rxjs';

import { UserDetails } from '../item.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _auth: Auth, private _firestore: Firestore) {}

  fetchUser() {
    return authState(this._auth).pipe(
      switchMap((user) => {
        if (!user) return EMPTY;

        const docRef = doc(this._firestore, `users/${user.uid}`);
        return docData(docRef) as Observable<UserDetails>; // TODO what if the user doc doesn't exist?
      })
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
