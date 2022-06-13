export interface Item {
  name: string;
  dateBought?: number; // date
  useBy?: number; // date
  notifyOn?: number; // date
  bestBefore?: number; // date
  storedIn?: string;
  comments?: string;
}

export interface Home {
  name: string;
  users: { [key: string]: true };
  storage: string[];
  items?: Item[]; // this would be a sub collection in Firestore
}
