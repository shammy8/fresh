import { Injectable } from '@angular/core';

import {
  arrayUnion,
  doc,
  collection,
  Firestore,
  serverTimestamp,
  writeBatch,
  deleteDoc,
} from '@angular/fire/firestore';

import { Item, ItemDto } from '../item.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private _firestore: Firestore) {}

  addItem(
    storedInValue: string,
    homeId: string,
    item: Item,
    updateStorage: boolean
  ) {
    const batch = writeBatch(this._firestore);

    if (updateStorage && storedInValue !== '') {
      batch.update(doc(this._firestore, `homes/${homeId}`), {
        storage: arrayUnion(storedInValue),
      });
    }

    const newItemRef = doc(
      collection(this._firestore, `homes/${homeId}/items`)
    );
    batch.set(newItemRef, {
      ...item,
      createdAt: serverTimestamp(),
    });

    return batch.commit();
  }

  updateItem(
    storedInValue: string,
    homeId: string,
    itemId: string,
    item: Item,
    updateStorage: boolean
  ) {
    const batch = writeBatch(this._firestore);

    if (updateStorage && storedInValue !== '') {
      batch.update(doc(this._firestore, `homes/${homeId}`), {
        storage: arrayUnion(storedInValue),
      });
    }

    batch.update(doc(this._firestore, `homes/${homeId}/items/${itemId}`), {
      ...item,
    });

    return batch.commit();
  }

  deleteItem(homeId: string, itemId: string) {
    return deleteDoc(doc(this._firestore, `homes/${homeId}/items/${itemId}`));
  }

  fromDto(itemDto: ItemDto): Item {
    return {
      id: itemDto.id,
      name: itemDto.name,
      storedIn: itemDto.storedIn,
      dateBought: itemDto.dateBought?.toDate() ?? null,
      primaryDate: itemDto.primaryDate?.toDate() ?? null,
      userDefinedDate: itemDto.userDefinedDate?.toDate() ?? null,
      useBy: itemDto.useBy?.toDate() ?? null,
      bestBefore: itemDto.bestBefore?.toDate() ?? null,
      notifyOn: itemDto.notifyOn?.toDate() ?? null,
      createdAt: itemDto.createdAt?.toDate() ?? null,
      comments: itemDto.comments,
    };
  }
}
