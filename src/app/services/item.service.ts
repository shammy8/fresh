import { Injectable } from '@angular/core';

import { Item, ItemDto } from '../item.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
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

  // TODO do we need toDto, firestore can take js dates
  // toDto(item: Item): ItemDto {}
}
