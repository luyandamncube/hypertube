import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemgridComponent } from './itemgrid.component';

describe('ItemgridComponent', () => {
  let component: ItemgridComponent;
  let fixture: ComponentFixture<ItemgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
