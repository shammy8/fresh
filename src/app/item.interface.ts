export interface Item {
  name: string;
  storedIn?: string;
  dateBought?: null | Date; // date
  useBy?: null | Date; // date
  bestBefore?: null | Date; // date
  notifyOn?: null | Date; // date
  comments?: string;
}

export interface Home {
  id?: string;
  name: string;
  users: { [key: string]: true };
  storage: string[];
  items?: Item[]; // this would be a sub collection in Firestore
}
