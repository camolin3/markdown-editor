import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuDropdownComponent } from '../menu-dropdown/menu-dropdown.component';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MenuNameComponent } from '../menu-name/menu-name.component';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuItemComponent,
        MenuNameComponent,
        MenuDropdownComponent,
        MenuComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const globalMock = jasmine.createSpyObj('window', ['open', 'print']);
    globalMock.location = { href: 'https://markdown.ml/editor/#-LHApkuIG7feTomeAW2Q' };
    component.global = <Window>globalMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openNewDocument', () => {
    it('opens a new tab.', () => {
      component.openNewDocument();
      expect(component.global.open).toHaveBeenCalledWith('https://markdown.ml/editor/', '_blank');
    });
  });

  describe('print', () => {
    it('call native method.', () => {
      component.print();
      expect(component.global.print).toHaveBeenCalled();
    });
  });

  describe('formatToggle', () => {
    it('should add bold.', () => {
      expect(component.formatToggle('hello', '**', '**')).toBe('**hello**');
    });

    it('should remove existing bold.', () => {
      expect(component.formatToggle('**hello**', '**', '**')).toBe('hello');
      expect(component.formatToggle('  **hello** ', '**', '**')).toBe('  hello ');
      expect(component.formatToggle('  **hello *world*** ', '**', '**')).toBe('  hello *world* ');
    });
  });
});
