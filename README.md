# Fresh

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.1.

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

## TODO

Version 0.1:

- Notification
- Allow add, remove homes.
- Allow adding/removing users to homes.
- Allow removal of storages. Renaming of storage might need to be done on cloud functions.
- Handle errors to do with promises and observables
- Add a version number
<!-- - Change to PWA -->
- Deploy to Firebase hosting

For later:

- Set initial home on app load.
- Should I allow users to drag items to different storage, like one column for each storage?
- Figure what to do with full text searching and pagination / infinite scrolling, to reduce document reads.
- Add virtual scrolling to items? Does it handle expansion boxes since the height can be changed.
- Hints for how to add storage
- Change all expansion panels to cards. Don't need to all the items dates and comments in the card. Users can see them in the edit screen. Is this OK?
