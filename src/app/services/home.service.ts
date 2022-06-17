import { Injectable } from '@angular/core';

import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';

import { Home } from '../item.interface';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private _homes: Home[] = [];

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
      })
    );
  }

  getStorageFromHome(homeId: string) {
    return this._homes.find((home) => home.id === homeId)?.storage ?? [];
  }
}
