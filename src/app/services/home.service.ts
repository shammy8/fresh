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
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  EMPTY,
  filter,
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
  private _homes: Home[] = [];

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
        this._homes = homes;
        this._homes$.next(homes);
      })
    );
  }

  getCurrentStorageFromHomeAsObservable(homeId: string) {
    return this._homes$.pipe(
      map((homes) => homes.find((home) => home.id === homeId)),
      map((home) => (home ? home.storage : []))
    );
  }

  // TODO remove and use above
  getStorageFromHome(homeId: string) {
    return this._homes.find((home) => home.id === homeId)?.storage ?? [];
  }

  removeStorage(homeId: string, storage: string) {
    updateDoc(doc(this._firestore, `homes/${homeId}`), {
      storage: arrayRemove(storage),
    });
  }
}
