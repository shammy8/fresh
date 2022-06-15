import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map, Observable, of, switchMap } from 'rxjs';

import {
  collection,
  collectionData,
  Firestore,
  limit,
  query,
} from '@angular/fire/firestore';

@Component({
  selector: 'fresh-home',
  template: `
    <pre>{{ items$ | async | json }} </pre>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {
  items$: Observable<any> = of([]); // TODO

  constructor(private _route: ActivatedRoute, private _firestore: Firestore) {}

  ngOnInit(): void {
    this.items$ = this._route.paramMap.pipe(
      switchMap((params) => {
        const homeId = params.get('homeId');
        console.log(homeId);
        const itemsQuery = query(
          collection(this._firestore, `home/${homeId}/items`),
          limit(10)
        );
        return collectionData(itemsQuery);
      })
    );
  }
}
