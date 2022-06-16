import { Timestamp } from '@angular/fire/firestore';

export interface Item {
  id?: string;
  name: string;
  storedIn?: string;
  dateBought?: null | Timestamp; // date
  userDefinedDate?: null | Timestamp; // date
  useBy?: null | Timestamp; // date
  bestBefore?: null | Timestamp; // date
  notifyOn?: null | Timestamp; // date
  comments?: string;
}

// export interface Item {
//   id?: string;
//   name: string;
//   storedIn?: string;
//   dateBought?: null | Date; // date
//   userDefinedDate?: null | Date; // date
//   useBy?: null | Date | Timestamp; // date
//   bestBefore?: null | Date; // date
//   notifyOn?: null | Date; // date
//   comments?: string;
// }

export interface Home {
  id?: string;
  name: string;
  users: { [key: string]: true };
  storage: string[];
  items?: Item[]; // this would be a sub collection in Firestore
}
