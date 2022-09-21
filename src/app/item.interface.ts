import { FormControl } from '@angular/forms';

import { Timestamp } from '@angular/fire/firestore';

import { DateTime } from 'luxon';

/**
 * The item the app sends Firestore
 */
export interface ItemToDto {
  name: string;
  storedIn: string;
  dateBought: null | Date;
  primaryDate: null | Date;
  userDefinedDate: null | Date;
  useBy: null | Date;
  bestBefore: null | Date;
  //   notifyOn: null | Date;
  createdAt: null | Date;
  comments: string;
}

/**
 * The item Firestore sends the app
 */
export interface ItemFromDto {
  id?: string;
  name: string;
  storedIn: string;
  dateBought: null | Timestamp;
  primaryDate: null | Timestamp;
  userDefinedDate: null | Timestamp;
  useBy: null | Timestamp;
  bestBefore: null | Timestamp;
  //   notifyOn: null | Timestamp;
  createdAt: null | Timestamp;
  comments: string;
}

export interface Item {
  id?: string;
  name: string;
  storedIn: string;
  dateBought: null | DateTime;
  primaryDate: null | DateTime;
  userDefinedDate: null | DateTime;
  useBy: null | DateTime;
  bestBefore: null | DateTime;
  //   notifyOn?: null | DateTime;
  createdAt: null | DateTime;
  comments: string;
}

export interface ItemFormGroup {
  id?: FormControl<string>;
  name: FormControl<string>;
  storedIn: FormControl<string>;
  dateBought: FormControl<null | DateTime>;
  primaryDate: FormControl<null | DateTime>;
  userDefinedDate: FormControl<null | DateTime>;
  useBy: FormControl<null | DateTime>;
  bestBefore: FormControl<null | DateTime>;
  //   notifyOn?: FormControl<null | DateTime>;
  createdAt: FormControl<null | DateTime>;
  comments: FormControl<string>;
}

export interface QueryItemsFormGroup {
  storedIn: FormControl<string>;
  sortBy: FormControl<string>;
  sortOrder: FormControl<'asc' | 'desc'>;
}

export interface ShoppingList {
  toBuy: string[];
  bought: string[];
}

export interface Home {
  id?: string;
  name: string;
  users: { [key: string]: true };
  usersDetails: { [key: string]: UserDetails };
  storage: string[];
  shoppingList: ShoppingList;
}

export interface HomeFormGroup {
  name: FormControl<string>;
  users: FormControl<string[]>;
  storage: FormControl<string[]>;
}

export interface UserDetails {
  displayName: string;
  email: string;
  uid: string;
}
