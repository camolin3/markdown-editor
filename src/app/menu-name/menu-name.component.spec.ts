import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNameComponent } from './menu-name.component';

describe('MenuNameComponent', () => {
  let component: MenuNameComponent;
  let fixture: ComponentFixture<MenuNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
