import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openNewDocument() {
    const url = window.location.href.split('#')[0];
    window.open(url, '_blank');
  }

  print() {
    window.print();
  }

}
