import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
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

  formatToggleBold(str: string) {
    const beforeRegex = /^\s*\*{2}/;
    const afterRegex = /\*{2}\s*$/;
    if (beforeRegex.test(str) && afterRegex.test(str)) {
      return str.replace(beforeRegex, '').replace(afterRegex, '');
    }
    return `**${str}**`;
  }

}
