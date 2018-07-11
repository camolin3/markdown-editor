import { AfterViewInit, Component, ViewChild } from '@angular/core';
import 'brace/ext/language_tools.js';
import 'brace/index';
import { Editor } from 'brace/index';
import 'brace/mode/markdown';
import 'brace/theme/eclipse';
import * as firebase from 'firebase/app';
import 'firebase/database';
import hljs from 'highlight.js';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import * as MarkdownIt from 'markdown-it';
import * as emoji from 'markdown-it-emoji';
import { AceEditorDirective } from 'ng2-ace-editor';
import dedent from 'ts-dedent';
import * as twemoji from 'twemoji';
import * as Firepad from '../libs/firepad/dist/firepad';
TimeAgo.locale(en);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(AceEditorDirective) ace: AceEditorDirective;
  md: MarkdownIt.MarkdownIt;
  lastModified;
  loaded = false;
  title = '';
  resultString: string;
  options = {
    indentedSoftWrap: true,
    printMargin: false,
    wrapBehavioursEnabled: true,
  };
  ref: firebase.database.Reference;
  timeAgo;

  constructor() {
    this.md = (new MarkdownIt({
      breaks: true,
      highlight: (str, lng) => {
        if (!lng || !hljs.getLanguage(lng)) {
          return '';
        }
        try { return hljs.highlight(lng, str).value; } catch (e) { }
      },
    }));
    this.md.use(emoji);
    const emojiToImage = (token, idx) => twemoji.parse(token[idx].content);
    this.md.renderer.rules.emoji = emojiToImage;
    this.timeAgo = new TimeAgo();
  }

  get lastModifiedAgo() {
    return this.lastModified ?
      `Last edit was ${this.timeAgo.format(this.lastModified)}` : '';
  }

  ngAfterViewInit() {
    const defaultText = dedent`# Hello!

    This is an _online_ **Markdown** editor :v:.

    Have some fun. Here you have a [Markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) ;).

    `;
    const editor: Editor = this.ace.editor;
    const session = editor.getSession();
    session.setUseWrapMode(true);
    editor.renderer.setShowGutter(false);
    editor.renderer.setPadding(20);
    (<any>editor.renderer).setScrollMargin(20, 10);

    const config = {
      apiKey: 'AIzaSyBK7k4vLvjRfJ2DOfzouMNAAgj9jwhQc4Y',
      authDomain: 'markdown-editor-8412c.firebaseapp.com',
      databaseURL: 'https://markdown-editor-8412c.firebaseio.com',
    };
    firebase.initializeApp(config);

    this.ref = this.getRef();
    const firepad = Firepad.fromACE(this.ref, editor, {
      defaultText,
    });
    const onSync = () => this.resultString = this.md.render(firepad.getText());
    firepad.on('ready', () => {
      this.loaded = true;
      onSync();
      editor.resize(true);
    });
    firepad.on('synced', onSync);

    this.ref.child('metadata').once('value')
      .then(snapshot => snapshot.val())
      .then(({ title }) => this.title = title);

    this.ref.child('history')
      .orderByChild('t')
      .limitToLast(1)
      .on('child_added', snapshot => {
        const timestamp = snapshot.val().t;
        this.lastModified = new Date(timestamp);
    });
  }

  onInputClicked({ target }) {
    if (this.title) {
      return;
    }
    const firstLine = this.resultString.split('\n', 1)[0].match(/>(.*)</)[1];
    this.title = firstLine || 'Untitled document';
    setTimeout(() => target.setSelectionRange(0, this.title.length));
  }

  onInputBlur() {
    const { title } = this;
    this.ref.update({ metadata: { title }});
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
