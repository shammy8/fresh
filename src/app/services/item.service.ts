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

import { DateTime } from 'luxon';

import { Item, ItemFromDto, ItemToDto } from '../item.interface';

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
      ...this.toDto(item),
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
      ...this.toDto(item),
    });

    return batch.commit();
  }

  deleteItem(homeId: string, itemId: string) {
    return deleteDoc(doc(this._firestore, `homes/${homeId}/items/${itemId}`));
  }

  toDto(item: Item): ItemToDto {
    return {
      name: item.name,
      storedIn: item.storedIn,
      dateBought: item.dateBought === null ? null : item.dateBought?.toJSDate(),
      primaryDate:
        item.primaryDate === null ? null : item.primaryDate?.toJSDate(),
      userDefinedDate:
        item.userDefinedDate === null ? null : item.userDefinedDate?.toJSDate(),
      useBy: item.useBy === null ? null : item.useBy?.toJSDate(),
      bestBefore: item.bestBefore === null ? null : item.bestBefore?.toJSDate(),
      //   notifyOn: itemDto.notifyOn?.toDate() ?? null,
      createdAt: item.createdAt === null ? null : item.createdAt?.toJSDate(),
      comments: item.comments,
    };
  }

  fromDto(itemDto: ItemFromDto): Item {
    return {
      id: itemDto.id,
      name: itemDto.name,
      storedIn: itemDto.storedIn,
      dateBought:
        itemDto.dateBought === null
          ? null
          : DateTime.fromJSDate(itemDto.dateBought?.toDate()),
      primaryDate:
        itemDto.primaryDate === null
          ? null
          : DateTime.fromJSDate(itemDto.primaryDate?.toDate()),
      userDefinedDate:
        itemDto.userDefinedDate === null
          ? null
          : DateTime.fromJSDate(itemDto.userDefinedDate?.toDate()),
      useBy:
        itemDto.useBy === null
          ? null
          : DateTime.fromJSDate(itemDto.useBy?.toDate()),
      bestBefore:
        itemDto.bestBefore === null
          ? null
          : DateTime.fromJSDate(itemDto.bestBefore?.toDate()),
      //   notifyOn: itemDto.notifyOn?.toDate() ?? null,
      createdAt:
        itemDto.createdAt === null
          ? null
          : DateTime.fromJSDate(itemDto.createdAt?.toDate()),
      comments: itemDto.comments,
    };
  }
}
