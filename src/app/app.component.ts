import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  result = [];
  ops = [];

  constructor() {
    const originalPush = this.ops.push;
    this.ops.push = (...args) => {
      const e = args[0];
      switch (e.ty) {
        case 'is':
          this.result.splice(e.ibi, 0, e.s);
          break;
        case 'ds':
          this.result.splice(e.si, e.ei - e.si);
          break;
        default:
          break;
      }
      return originalPush.call(this.ops, ...args);
    };
  }

  onKeyUp(event) {
    const { key } = event;
    const position = document.getSelection().focusOffset;
    if (key === 'Backspace') {
      this.ops.push({ ty: 'ds', si: position, ei: position + 1 });
    } else if (key === 'Delete') {
      this.ops.push({ ty: 'ds', si: position, ei: position + 1 });
    } else if (key.length === 1) {
      this.ops.push({ ty: 'is', ibi: position - 1, s: key });
    } else {
      console.log(event, document.getSelection());
    }
  }
}
