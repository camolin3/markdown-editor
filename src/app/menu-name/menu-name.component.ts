import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-name',
  templateUrl: './menu-name.component.html',
  styleUrls: ['./menu-name.component.css']
})
export class MenuNameComponent implements OnInit {
  @Input()
  name: string;
  opened = false;

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.opened = !this.opened;
  }

}
