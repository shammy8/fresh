# Fresh

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.1.

## TODOs

Version 0.1:

- [x] Allow adding homes
- [x] Change tick next to home to a cog which opens a little menu with more options like managing users, deleting home
- [x] Allow removing homes
- [x] Allow adding/removing users to homes.
  - [x] Refactor to allow adding by email and subscribe to home in the manage-users component
- [x] Add a users page to allowing changing display name and to show their email/uid
- [x] Allow removal of storages.
- [x] Handle long home / item storage names
  - [x] Add verification for storedIn length
- [x] Handle errors to do with promises and observables
- [x] Hints for how to add storage
- [x] Users collection update trigger to update the usersDetails property in homes when display name is changed
- [x] Add name/id to input fields. Take a look at the autocomplete attribute
- [x] Change to PWA
- [x] Add a version number
- [x] Deploy to Firebase hosting

For later:

- [x] Move the vertical scroll below the tabs
- [ ] Change the logo in the Chrome tab
- [x] Add a shopping list (similar to Google Notes), deleting from main app will ask user to move to shopping list
  - [ ] Firestore rules for shoppingList
  - [ ] Allow changing item names in shopping list
- [x] Remember previous query, save on device instead of firebase
- [x] Check the source maps size stuff
- [x] Humanize duration instead of display the primary date on expansion panel?
- [ ] Allow user to choose the day difference to apply the humanize duration color
- [x] Change User to something like My Profile
- [ ] Switch my BS in services to Ngrx / Ngrx component store?
- [x] Look at PWA best practices with Firebase
- [ ] Allow to add user by using id in manage users?
  - [ ] Allow adding users by email/uid in add home component?
- [ ] Set initial home on app load.
- [ ] Add barcode scanner to quickly add items??
- [ ] Renaming of storages under all items??
- [ ] Think how to handle closing bottom sheet to work well in online and offline mode
- [ ] Add different users level like home owner / regular user?
- [ ] Add other login providers
  - [ ] Style login page
- [ ] Styling
  - [ ] Add animations for adding removing items in both tabs
  - [ ] Change the styling of the app
  - [ ] Some styling are repeated, can refactor eg expansion panel button container
  - [x] Create custom logos for the app, use it in the manifest.webmanifest
  - [x] Handle overflow of homes
- [ ] Scrolling / pagination / searching
  - [ ] Tag functionality to easier search items for now while I think about the below indented ones
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

## Deploy

Run `ng deploy` to build and deploy the project to Firebase Hosting. The build artifacts will be stored in the `dist/` directory (I think).

## Firestore Rules

Run `firebase deploy --only firestore:rules` to deploy the Firestore rules. You can not pull updates to the rules from the console down into this repo. So if you make a change in the Firebase Console you need to copy and paste it here too.
