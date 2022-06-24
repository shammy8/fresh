# Fresh

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.1.

## TODOs

Version 0.1:

- [x] Allow adding homes
- [x] Change tick next to home to a cog which opens a little menu with more options like managing users, deleting home
- [ ] Allow removing homes
- [ ] Allow adding/removing users to homes.
- [x] Allow removal of storages.
- [x] Handle long home / item storage names
  - [x] Add verification for storedIn length
- [ ] Handle errors to do with promises and observables
- [x] Hints for how to add storage
- [x] Change to PWA
- [x] Add a version number
- [ ] Deploy to Firebase hosting

For later:

- [ ] Set initial home on app load.
- [ ] Add barcode scanner to quickly add items??
- [ ] Renaming of storages under all items??
- [ ] Think how to handle closing bottom sheet to work well in online and offline mode
- [ ] Styling
  - [ ] Change the styling of the app
  - [ ] Create custom logos for the app, use it in the manifest.webmanifest
  - [x] Handle overflow of homes
- [ ] Scrolling / pagination / searching
  - [ ] Should I allow users to drag items to different storage, like one column for each storage?
  - [ ] Figure what to do with full text searching and pagination / infinite scrolling, to reduce document reads.
  - [ ] Add virtual scrolling to items? Does it handle expansion boxes since the height can be changed.
  - [ ] Change all expansion panels to cards. Don't need to all the items dates and comments in the card. Users can see them in the edit screen. Makes virtual scrolling easier. Is this OK?
- [ ] Cloud messaging
  - [ ] Better configure cloud messaging.
  - [ ] Fix notification for non chrome browser
- [ ] Hints
  - [ ] Hints for what desc/asc mean?
  - [ ] Hints for what primary date is

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4201/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Firestore Rules

Run `firebase deploy --only firestore:rules` to deploy the Firestore rules. You can not pull updates to the rules from the console down into this repo. So if you make a change in the Firebase Console you need to copy and paste it here too.
