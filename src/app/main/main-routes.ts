import { Routes } from '@angular/router';

import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { MainComponent } from './main.component';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../no-home-selected/no-home-selected.component').then(
            (c) => c.NoHomeSelectedComponent
          ),
        canActivate: [AuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
      },
      {
        path: 'home/:homeId',
        loadComponent: () =>
          import('../home/home.component').then((c) => c.HomeComponent),
        canActivate: [AuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
      },
    ],
  },
];
