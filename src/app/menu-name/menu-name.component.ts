import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu-name',
  templateUrl: './menu-name.component.html',
  styleUrls: ['./menu-name.component.css']
})
export class MenuNameComponent implements OnInit {
  @Input() name: string;
  @Input() open = false;
  @Output() hover = new EventEmitter<[MenuNameComponent, MouseEvent]>();
  @Output() click = new EventEmitter<[MenuNameComponent, MouseEvent]>();
  constructor() { }

  ngOnInit() {
  }

  onClick(event) {
    this.click.emit([this, event]);
  }

  onHoverEnter(event) {
    this.hover.emit([this, event]);
  }

}
