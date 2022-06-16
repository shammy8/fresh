import { TestBed } from '@angular/core/testing';

import { ItemsMapperService } from './items-mapper.service';

describe('ItemsMapperService', () => {
  let service: ItemsMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
