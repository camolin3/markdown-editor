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
  result = '';
  quote = false;


  constructor() {
  }

  get resultString() {
    const md = new MarkdownIt();
    md.use(emoji);
    md.renderer.rules.emoji = (token, idx) => twemoji.parse(token[idx].content);
    return md.render(this.result);
  }
}
