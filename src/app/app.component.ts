import { Component } from '@angular/core';

@Component({
  selector: 'fresh-root',
  template: `
    <mat-toolbar color="primary"><h1>Fresh</h1></mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {}
