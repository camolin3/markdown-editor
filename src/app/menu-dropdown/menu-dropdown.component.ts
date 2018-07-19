import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { MenuNameComponent } from '../menu-name/menu-name.component';

@Component({
  selector: 'app-menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.css']
})
export class MenuDropdownComponent implements AfterContentInit {
  @ContentChildren(MenuNameComponent) names: QueryList<MenuNameComponent>;
  isOpen = false;
  currentOpen: MenuNameComponent;

  constructor() { }

  ngAfterContentInit() {
    this.names.forEach(n => {
      n.click.subscribe(([name]) => {
        this.isOpen = !this.isOpen;
        if (!this.isOpen) {
          this.currentOpen.open = false;
          this.currentOpen = null;
          return;
        }
        name.open = true;
        this.currentOpen = name;
      });
      n.hover.subscribe(([name]) => {
        if (!this.isOpen || this.currentOpen === name) {
          return;
        }
        this.currentOpen.open = false;
        name.open = true;
        this.currentOpen = name;
      });
    });
  }

}
