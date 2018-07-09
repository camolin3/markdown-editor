import { AfterViewInit, Component, ViewChild } from '@angular/core';
import 'brace/ext/language_tools.js';
import 'brace/index';
import 'brace/mode/markdown';
import 'brace/theme/eclipse';
import * as MarkdownIt from 'markdown-it';
import * as emoji from 'markdown-it-emoji';
import { AceEditorDirective } from 'ng2-ace-editor';
import dedent from 'ts-dedent';
import * as twemoji from 'twemoji';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(AceEditorDirective) ace: AceEditorDirective;
  title = '';
  result = dedent`# Hello!

  This is an _online_ **Markdown** editor :v:.

  Have some fun. Here you have a [Markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) ;).

  `;
  options = {
    indentedSoftWrap: true,
    printMargin: false,
    wrapBehavioursEnabled: true,
  };

  constructor() {
  }

  ngAfterViewInit() {
    const editor = this.ace.editor;
    const session = editor.getSession();
    session.setUseWrapMode(true);
    editor.renderer.setShowGutter(false);
    editor.renderer.setPadding(20);
    editor.renderer.setScrollMargin(20, 10);
    editor.on('change', ({ action, start, lines }) => {
      const pos = this.result.split('\n', start.row)
        .map(l => l.length)
        .reduce((acc, val) => acc + val, start.column + start.row);
      console.log(action, JSON.stringify({ pos, lines }));
    });
  }

  get resultString() {
    const md = new MarkdownIt({
      breaks: true,
    });
    md.use(emoji);
    md.renderer.rules.emoji = (token, idx) => twemoji.parse(token[idx].content);
    return md.render(this.result);
  }

  onInputClicked({ target }) {
    if (this.title) {
      return;
    }
    this.title = this.result.split('\n', 1)[0] || 'Untitled document';
    setTimeout(() => target.setSelectionRange(0, this.title.length));
  }
}
