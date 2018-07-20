import { AfterContentInit, Component, ContentChildren, HostListener, QueryList } from '@angular/core';
import { filter, map, tap } from 'rxjs/operators';
import { MenuNameComponent } from '../menu-name/menu-name.component';

@Component({
  selector: 'app-menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.css']
})
export class MenuDropdownComponent implements AfterContentInit {
  @ContentChildren(MenuNameComponent) names: QueryList<MenuNameComponent>;
  isOpen = false;
  _currentOpen: MenuNameComponent;

  get currentOpen() { return this._currentOpen; }
  set currentOpen(name) {
    if (this._currentOpen) { this._currentOpen.open = false; }
    if (name) { name.open = true; }
    this._currentOpen = name;
  }

  constructor() { }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.isOpen) { return; }
    this.isOpen = false;
    this.currentOpen = null;
  }

  ngAfterContentInit() {
    this.names.forEach(n => {
      n.clicked.pipe(
        tap(() => this.isOpen = !this.isOpen),
        map(([name]) => this.isOpen ? name : null),
        tap(name => this.currentOpen = name),
      ).subscribe();
      n.hovered.pipe(
        filter(([name]) => this.isOpen && this.currentOpen !== name),
        tap(([name]) => this.currentOpen = name)
      ).subscribe();
    });
  }
}
