import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-name',
  templateUrl: './menu-name.component.html',
  styleUrls: ['./menu-name.component.css']
})
export class MenuNameComponent {
  @Input() name: string;
  @Input() open = false;
  @Output() hovered = new EventEmitter<[MenuNameComponent, MouseEvent]>();
  @Output() clicked = new EventEmitter<[MenuNameComponent, MouseEvent]>();
  constructor() { }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.clicked.emit([this, event]);
  }

  onHoverEnter(event: MouseEvent) {
    this.hovered.emit([this, event]);
  }

}
