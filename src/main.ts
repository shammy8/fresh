import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  //   provideRouter,
  RouterModule,
  Routes,
  //   withPreloading,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  LuxonDateAdapter,
  MAT_LUXON_DATE_ADAPTER_OPTIONS,
  MAT_LUXON_DATE_FORMATS,
} from '@angular/material-luxon-adapter';

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

setTimeout(() =>
  // TODO does this help?
  bootstrapApplication(AppComponent, {
    providers: [
      provideAnimations(),
      //   provideRouter(routes, withPreloading(PreloadAllModules)), // TODO check if routing works
      importProvidersFrom([
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
        // MatNativeDateModule, // TODO right now you need to type in the date as mm/dd/yyyy.
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
        // TODO does this help?
        provide: APP_INITIALIZER,
        useFactory: () => () => new Promise((resolve) => setTimeout(resolve)),
        multi: true,
      },
      {
        provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
        useValue: { duration: 3000, verticalPosition: 'top' },
      },
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
      {
        provide: DateAdapter,
        useClass: LuxonDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_LUXON_DATE_ADAPTER_OPTIONS],
      },
      { provide: MAT_DATE_FORMATS, useValue: MAT_LUXON_DATE_FORMATS },
    ],
  }).catch((err) => console.error(err))
);
