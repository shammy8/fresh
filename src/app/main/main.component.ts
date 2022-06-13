import { Component, OnInit } from '@angular/core';

import { Auth } from '@angular/fire/auth';
import {
  collection,
  collectionData,
  DocumentData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Home } from '../item.interface';

@Component({
  selector: 'fresh-main',
  template: `
    <p>main works!</p>
    <pre>{{ homes | async | json }} </pre>
  `,
  styles: [],
})
export class MainComponent implements OnInit {
  homes: Observable<Home[]> = of([]);

  constructor(private _auth: Auth, private _firestore: Firestore) {}

  ngOnInit(): void {
    const userId = this._auth.currentUser?.uid;
    if (userId) {
      const homesForUserQuery = query(
        collection(this._firestore, 'home'),
        where(`users.${userId}`, '==', true)
      );
      //   getDocs(homesForUserQuery).then((homesSnapshot) =>
      //     homesSnapshot.forEach((data) => {
      //       console.log(data.data());
      //     })
      //   );
      // TODO is below type casting correct
      this.homes = collectionData(homesForUserQuery) as Observable<Home[]>;
    }
  }
}
