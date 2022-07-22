import { ParamMap } from '@angular/router';

import { OrderByDirection } from '@angular/fire/firestore';

/**
 * Creates a query item class. If no queryParamMap is passed it on initialisation it will initialise with
 * storedIn = '', sortBy: 'primaryDate', sortOrder: 'asc'
 */
export class QueryItems {
  storedIn: string = '';
  sortBy: SortByOptions = SortByOptions.PrimaryDate;
  sortOrder: OrderByDirection = 'asc';

  constructor(queryParamMap?: ParamMap) {
    const storedIn = queryParamMap?.get('storedIn')
    if (storedIn) {
      this.storedIn = storedIn;
    }

    const sortBy = queryParamMap?.get('sortBy')
    if (sortBy && this._isValidSortBy(sortBy)) {
      this.sortBy = sortBy as SortByOptions;
    }

    const sortOrder = queryParamMap?.get('sortOrder')
    if (sortOrder && this._isValidOrderByDirection(sortOrder)) {
      this.sortOrder = sortOrder as OrderByDirection;
    }
  }

  // TODO find a better way to do this
  private _isValidSortBy(input: string): boolean {
    return (<any>Object).values(SortByOptions).includes(input)
  }

  private _isValidOrderByDirection(input: string) {
    return input === 'asc' || input === 'desc';
  }
}

export enum SortByOptions {
  CreatedAt = 'createdAt',
  PrimaryDate = 'primaryDate',
  BestBefore = 'bestBefore',
  UseBy = 'useBy',
  UserDefinedDate = 'userDefinedDate',
  DateBought = 'dateBought',
  StoredIn = 'storedIn',
  Name = 'name',
}
