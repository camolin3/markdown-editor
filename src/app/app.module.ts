import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CodemirrorModule } from 'ng2-codemirror';
import { AppComponent } from './app.component';
import { MenuDropdownComponent } from './menu-dropdown/menu-dropdown.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuNameComponent } from './menu-name/menu-name.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuNameComponent,
    MenuItemComponent,
    MenuDropdownComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CodemirrorModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
