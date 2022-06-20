import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoHomeSelectedComponent } from './no-home-selected.component';

describe('NoHomeSelectedComponent', () => {
  let component: NoHomeSelectedComponent;
  let fixture: ComponentFixture<NoHomeSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoHomeSelectedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoHomeSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
