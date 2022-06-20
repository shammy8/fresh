import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import {
  AuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { NoHomeSelectedComponent } from './no-home-selected/no-home-selected.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo(['']) },
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
    children: [
      {
        path: '',
        component: NoHomeSelectedComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
      },
      {
        path: ':homeId',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
