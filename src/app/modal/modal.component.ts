import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() title = 'Modal Title';

  @HostBinding('class.is-display') @Input() isDisplay = false;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('click') onBackdropClick() {
    this.isDisplay = false;
  }

}
