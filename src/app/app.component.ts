import { Component } from '@angular/core';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'fresh-root',
  template: `
    <mat-toolbar color="primary"><h1>Fresh</h1></mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  constructor(private _afs: Firestore) {
    const testRef = collection(this._afs, 'test');
    collectionData(testRef, { idField: 'id' }).subscribe(console.log);
  }

  ngOnInit() {}
}
