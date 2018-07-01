import { Component } from '@angular/core';
import * as MarkdownIt from 'markdown-it';
import * as emoji from 'markdown-it-emoji';
import * as twemoji from 'twemoji';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  reqId = 0;
  sId = 1;
  currentLine = 0;
  result = [];
  ops = [];
  quote = false;

  constructor() {
    const originalPush = this.ops.push;
    this.ops.push = (...args) => {
      const e = args[0];
      switch (e.ty) {
        case 'is':
          this.result.splice(e.ibi, 0, e.s);
          break;
        case 'ds':
          this.result.splice(e.si - 1, e.ei - e.si + 1);
          break;
        default:
          break;
      }
      return originalPush.call(this.ops, ...args);
    };
  }

  get resultString() {
    const md = new MarkdownIt();
    md.use(emoji);
    md.renderer.rules.emoji = (token, idx) => twemoji.parse(token[idx].content);
    return md.render(this.result.join(''));
  }

  get cursor() {
    const sel = document.getSelection();
    const divEl = ('tagName' in sel.anchorNode) ?
      sel.anchorNode : sel.anchorNode.parentElement;
    const mainEl = divEl.parentElement;

    const lineIndex = Array.prototype.indexOf.call(mainEl.children, divEl);
    return Array.from(mainEl.children)
      .filter((el, i) => i < lineIndex)
      .reduce((acc, el: HTMLDivElement) => acc + el.innerText.length + 1, sel.focusOffset + 1);
  }

  onPaste(event) {
    // TODO: handle this event, as well as onCut
    console.log(event);
  }

  onKeyPress(event: KeyboardEvent) {
    let { key } = event;

    if (key === 'Dead' && event.code === 'Quote') {
      this.quote = true;
      return;
    }

    if (key === 'Backspace') {
      this.ops.push({ ty: 'ds', si: this.cursor - 1, ei: this.cursor - 1 });
    } else if (key === 'Delete') {
      this.ops.push({ ty: 'ds', si: this.cursor, ei: this.cursor });
    } else if (key === 'Enter') {
      this.ops.push({ ty: 'is', ibi: this.cursor, s: '\r\n' });
    } else if (key.length === 1) {
      if (this.quote) {
        key = {
          'a': 'á',
          'e': 'é',
          'i': 'í',
          'o': 'ó',
          'u': 'ú',
          'A': 'Á',
          'E': 'É',
          'I': 'Í',
          'O': 'Ó',
          'U': 'Ú',
        }[key] || key;
      }
      this.ops.push({ ty: 'is', ibi: this.cursor - 1, s: key });
    } else {
      console.log(key, this.cursor);
    }
    this.quote = false;
  }
}
