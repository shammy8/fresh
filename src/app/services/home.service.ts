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
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
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

  constructor(private _auth: Auth, private _firestore: Firestore) {}

  fetchHomes() {
    return authState(this._auth).pipe(
      switchMap((user) => {
        if (!user) return EMPTY;

        const homesForUserQuery = query(
          collection(this._firestore, 'homes'),
          where(`users.${user.uid}`, '==', true)
        );
        return collectionData(homesForUserQuery, {
          idField: 'id',
        }) as Observable<Home[]>;
      }),
      tap((homes) => {
        this._homes$.next(homes);
      })
    );
  }

  addHome(home: Home) {
    const user = this._auth.currentUser?.uid
    if (!user) throw Error('Not logged in')

    home.users[user] = true
    return addDoc(collection(this._firestore, 'homes'), home);
  }

  getCurrentStorageFromHome$(homeId: string) {
    return this._homes$.pipe(
      map((homes) => homes.find((home) => home.id === homeId)),
      map((home) => (home ? home.storage : []))
    );
  }

  removeStorage(homeId: string, storage: string) {
    updateDoc(doc(this._firestore, `homes/${homeId}`), {
      storage: arrayRemove(storage),
    });
  }
}
