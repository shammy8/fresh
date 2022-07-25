import { FormControl } from '@angular/forms';

import { Timestamp } from '@angular/fire/firestore';

/**
 * The item Firestore sends the app
 */
export interface ItemDto {
  id?: string;
  name: string;
  storedIn: string;
  dateBought: null | Timestamp;
  primaryDate: null | Timestamp;
  userDefinedDate: null | Timestamp;
  useBy: null | Timestamp;
  bestBefore: null | Timestamp;
  notifyOn: null | Timestamp;
  createdAt: null | Timestamp;
  comments: string;
}

export interface Item {
  id?: string;
  name: string;
  storedIn: string;
  dateBought: null | Date;
  primaryDate: null | Date;
  userDefinedDate: null | Date;
  useBy: null | Date;
  bestBefore: null | Date;
  notifyOn?: null | Date;
  createdAt: null | Date;
  comments: string;
}

export interface ItemFormGroup {
  id?: FormControl<string>;
  name: FormControl<string>;
  storedIn: FormControl<string>;
  dateBought: FormControl<null | Date>;
  primaryDate: FormControl<null | Date>;
  userDefinedDate: FormControl<null | Date>;
  useBy: FormControl<null | Date>;
  bestBefore: FormControl<null | Date>;
  notifyOn?: FormControl<null | Date>;
  createdAt: FormControl<null | Date>;
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
  shoppingList?: ShoppingList;
  items?: Item[]; // TODO think we can remove this, this would be a sub collection in Firestore
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
