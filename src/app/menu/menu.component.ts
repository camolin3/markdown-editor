import { Component, OnInit, Input } from '@angular/core';
import * as escapeForRegex from 'escape-string-regexp';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() cm;
  global: Window;
  constructor() {
    this.global = window;
  }

  ngOnInit() {
  }

  openNewDocument() {
    const url = this.global.location.href.split('#')[0];
    this.global.open(url, '_blank');
  }

  print() {
    this.global.print();
  }

  insertLink() {
    this.cm.replaceSelection('[link](https://gooogle.com/)');
  }

  insertLine() {
    this.cm.replaceSelection('\n---\n');
  }

  insertImage() {
    this.cm.replaceSelection('\n![img description](https://78.media.tumblr.com/avatar_f27f604004a0_128.png)\n');
  }

  toggleBold() {
    this.genericToggle('**', '**');
  }

  toggleItalic() {
    this.genericToggle('_', '_');
  }

  toggleStrikethrough() {
    this.genericToggle('~~', '~~');
  }

  genericToggle(before: string, after: string) {
    const original = this.cm.getSelection();
    const changed = this.formatToggle(original, before, after);
    this.cm.replaceSelection(changed, 'around');
  }

  formatToggle(str: string, before: string, after: string) {
    const regBefore = escapeForRegex(before);
    const regAfter = escapeForRegex(after);
    const regex = new RegExp(`^(\\s*)(${regBefore})(.*)(${regAfter})(\\s*$)`);
    if (regex.test(str)) {
      return str.replace(regex, '$1$3$5');
    }
    return before + str + after;
  }

}
