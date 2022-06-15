export interface Item {
  name: string;
  dateBought?: number | Date; // date
  useBy?: number | Date; // date
  notifyOn?: number | Date; // date
  bestBefore?: number | Date; // date
  storedIn?: string;
  comments?: string;
}

export interface Home {
  id?: string;
  name: string;
  users: { [key: string]: true };
  storage: string[];
  items?: Item[]; // this would be a sub collection in Firestore
}
