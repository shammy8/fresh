import { Injectable } from '@angular/core';

import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  updateDoc,
  doc,
  arrayRemove,
  addDoc,
  orderBy,
  deleteField,
  deleteDoc,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';

import {
  BehaviorSubject,
  catchError,
  EMPTY,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

import { Home } from '../item.interface';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private _homes$: BehaviorSubject<Home[]> = new BehaviorSubject([] as Home[]);
  homes$ = this._homes$.asObservable();

  constructor(
    private _auth: Auth,
    private _firestore: Firestore,
    private _fireFunctions: Functions
  ) {}

  fetchHomes() {
    return authState(this._auth).pipe(
      switchMap((user) => {
        if (!user) return EMPTY;

        const homesForUserQuery = query(
          collection(this._firestore, 'homes'),
          where(`users.${user.uid}`, '==', true),
          orderBy('name')
        );
        return (
          collectionData(homesForUserQuery, {
            idField: 'id',
          }) as Observable<Home[]>
        ).pipe(
          catchError((error) => {
            console.error(error);
            return EMPTY;
          })
        );
      }),
      tap((homes) => {
        this._homes$.next(homes);
      })
    );
  }

  addHome(home: Home) {
    return addDoc(collection(this._firestore, 'homes'), home);
  }

  deleteHome(home: Home) {
    return deleteDoc(doc(this._firestore, `homes/${home.id!}`));
  }

  getCurrentHomeFromHome$(homeId: string) {
    return this._homes$.pipe(
      map((homes) => homes.find((home) => home.id === homeId)),
      map((home) => (home ? home : null))
    );
  }

  getCurrentStorageFromHome$(homeId: string) {
    return this._homes$.pipe(
      map((homes) => homes.find((home) => home.id === homeId)),
      map((home) => (home ? home.storage : []))
    );
  }

  removeStorage(homeId: string, storage: string) {
    return updateDoc(doc(this._firestore, `homes/${homeId}`), {
      storage: arrayRemove(storage),
    });
  }

  updateUsers(homeId: string | undefined, users: { [key: string]: boolean }) {
    if (!homeId) return;
    return updateDoc(doc(this._firestore, `homes/${homeId}`), {
      users: { ...users },
    });
  }

  addUserToHomeUsingEmail(homeId: string | undefined, email: string) {
    const fn = httpsCallable<
      { homeId: string | undefined; email: string },
      unknown // TODO type this
    >(this._fireFunctions, 'addUsersToHomeUsingEmail');
    return fn({ homeId, email });
  }

  deleteUser(homeId: string, userId: string) {
    return updateDoc(doc(this._firestore, `homes/${homeId}`), {
      [`users.${userId}`]: deleteField(),
      [`usersDetails.${userId}`]: deleteField(),
    });
  }
}
