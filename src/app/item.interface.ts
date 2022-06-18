import { Timestamp } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';

/**
 * The item Firestore sends the app
 */
export interface ItemDto {
  id?: string;
  name: string;
  storedIn: string;
  dateBought: null | Timestamp;
  chiefDate: null | Timestamp;
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
  chiefDate: null | Date;
  userDefinedDate: null | Date;
  useBy: null | Date;
  bestBefore: null | Date;
  notifyOn: null | Date;
  createdAt: null | Date;
  comments: string;
}

export interface ItemFormGroup {
  id?: FormControl<string>;
  name: FormControl<string>;
  storedIn: FormControl<string>;
  dateBought: FormControl<null | Date>;
  chiefDate: FormControl<null | Date>;
  userDefinedDate: FormControl<null | Date>;
  useBy: FormControl<null | Date>;
  bestBefore: FormControl<null | Date>;
  notifyOn?: FormControl<null | Date>;
  comments: FormControl<string | null>;
}

export interface QueryItemsFormGroup {
  storedIn: FormControl<string>;
  sortBy: FormControl<string>;
  sortOrder: FormControl<'asc' | 'desc'>;
}

export interface QueryItems {
  storedIn: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface Home {
  id?: string;
  name: string;
  users: { [key: string]: true };
  storage: string[];
  items?: Item[]; // this would be a sub collection in Firestore
}
