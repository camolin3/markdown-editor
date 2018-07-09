import { AfterViewInit, Component, ViewChild } from '@angular/core';
import 'brace/ext/language_tools.js';
import 'brace/index';
import 'brace/mode/markdown';
import 'brace/theme/eclipse';
import firebase from 'firebase/app';
import hljs from 'highlight.js';
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

    const config = {
      apiKey: 'AIzaSyBK7k4vLvjRfJ2DOfzouMNAAgj9jwhQc4Y',
      authDomain: 'markdown-editor-8412c.firebaseapp.com',
      databaseURL: 'https://markdown-editor-8412c.firebaseio.com',
    };
    firebase.initializeApp(config);
  }

  get resultString() {
    const md = new MarkdownIt({
      breaks: true,
      highlight: (str, lng) => {
        if (lng && hljs.getLanguage(lng)) {
          try {
            return hljs.highlight(lng, str).value;
          } catch (e) {}
        }
        return '';
      },
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

  getRef() {
    let ref = firebase.database().ref();
    const hash = window.location.hash.replace(/#/g, '');
    if (hash) {
      ref = ref.child(hash);
    } else {
      // generate unique location.
      ref = ref.push();
      window.location.href = window.location + '#' + ref.key;
    }
    return ref;
  }
}
