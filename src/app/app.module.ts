import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AceEditorModule } from 'ng2-ace-editor';
import { AppComponent } from './app.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuNameComponent } from './menu-name/menu-name.component';
import { MenuDropdownComponent } from './menu-dropdown/menu-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuNameComponent,
    MenuItemComponent,
    MenuDropdownComponent,
  ],
  imports: [
    BrowserModule,
    AceEditorModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
