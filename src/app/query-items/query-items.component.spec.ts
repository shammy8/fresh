import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryItemsComponent } from './query-items.component';

describe('QueryItemsComponent', () => {
  let component: QueryItemsComponent;
  let fixture: ComponentFixture<QueryItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
