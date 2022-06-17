import { Injectable } from '@angular/core';

import { Item, ItemDto } from '../item.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemsMapperService {
  fromDto(itemDto: ItemDto): Item {
    return {
      id: itemDto.id,
      name: itemDto.name,
      storedIn: itemDto.storedIn,
      dateBought: itemDto.dateBought?.toDate() ?? null,
      chiefDate: itemDto.chiefDate?.toDate() ?? null,
      userDefinedDate: itemDto.userDefinedDate?.toDate() ?? null,
      useBy: itemDto.useBy?.toDate() ?? null,
      bestBefore: itemDto.bestBefore?.toDate() ?? null,
      notifyOn: itemDto.notifyOn?.toDate() ?? null,
      comments: itemDto.comments,
    };
  }

  // TODO do we need toDto, firestore can take js dates
  // toDto(item: Item): ItemDto {}
}
