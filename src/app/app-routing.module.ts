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

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
    // TODO do I need canActivate or canActivateChildren here
    children: [
      {
        path: ':homeId',
        component: HomeComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo(['']) },
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
