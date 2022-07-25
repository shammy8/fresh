import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { LetModule } from '@ngrx/component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import {
  provideFirestore,
  getFirestore,
  enableIndexedDbPersistence,
} from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import {
  FunctionsModule,
  getFunctions,
  provideFunctions,
} from '@angular/fire/functions';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemComponent } from './item/item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { QueryItemsComponent } from './query-items/query-items.component';
import { NoHomeSelectedComponent } from './no-home-selected/no-home-selected.component';
import { AddHomeComponent } from './add-home/add-home.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HumanizeDurationPipe } from './pipes/humanize-duration.pipe';
import { InventoryComponent } from './inventory/inventory.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HomeComponent,
    AddItemComponent,
    ItemComponent,
    EditItemComponent,
    QueryItemsComponent,
    NoHomeSelectedComponent,
    AddHomeComponent,
    ManageUsersComponent,
    UserProfileComponent,
    HumanizeDurationPipe,
    InventoryComponent,
    ShoppingListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatBottomSheetModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDividerModule,
    ClipboardModule,
    DragDropModule,
    LetModule,
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
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 3000, verticalPosition: 'top' },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
