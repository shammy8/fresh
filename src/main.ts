import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  enableIndexedDbPersistence,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import {
  FunctionsModule,
  getFunctions,
  provideFunctions,
} from '@angular/fire/functions';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./app/login/login.component').then((c) => c.LoginComponent),
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo(['']) },
  },
  {
    path: '',
    loadChildren: () =>
      import('./app/main/main-routes').then((c) => c.MAIN_ROUTES),
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    importProvidersFrom([
      RouterModule.forRoot(routes, { preloadingStrategy:  PreloadAllModules }),
      MatNativeDateModule,
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideFirestore(() => {
        const firestore = getFirestore();
        enableIndexedDbPersistence(firestore)
          .then(() => {
            console.log('Successfully enabled persistence');
          })
          .catch((error) => {
            alert(
              'Offline mode has errored, make sure the app is only opened in one tab. ' +
                error
            );
          });
        return firestore;
      }),
      provideMessaging(() => getMessaging()),
      FunctionsModule,
      provideFunctions(() => getFunctions()), // TODO figure out how to set the region
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      }),
    ]),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 3000, verticalPosition: 'top' },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
}).catch((err) => console.error(err));
