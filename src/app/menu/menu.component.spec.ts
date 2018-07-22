import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MenuNameComponent } from '../menu-name/menu-name.component';
import { MenuDropdownComponent } from '../menu-dropdown/menu-dropdown.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuItemComponent,
        MenuNameComponent,
        MenuDropdownComponent,
        MenuComponent
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
