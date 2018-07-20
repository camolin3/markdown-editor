import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
  colors = {
    Navy: '#001f3f',
    Blue: '#0074D9',
    Aqua: '#7FDBFF',
    Teal: '#39CCCC',
    Olive: '#3D9970',
    Green: '#2ECC40',
    Lime: '#01FF70',
    Yellow: '#FFDC00',
    Orange: '#FF851B',
    Red: '#FF4136',
    Maroon: '#85144b',
    Fuchsia: '#F012BE',
    Purple: '#B10DC9',
    Black: '#111111',
    Gray: '#AAAAAA',
    Silver: '#DDDDDD',
  };
  emojis = {
    '🐒': 'Monkey',
    '🐤': 'Chicken',
    '🦆': 'Duck',
    '🦉': 'Owl',
    '🦇': 'Bat',
    '🦄': 'Unicorn',
    '🦋': 'Butterfly',
    '🐙': 'Octopus',
    '🕷': 'Spider',
    '🐳': 'Whale',
    '🐀': 'Rat',
    '🦎': 'Lizard',
  };
  firepad;
  md: MarkdownIt.MarkdownIt;
  lastModified;
  loaded = false;
  _title = '';
  resultString: string;
  options = {
    indentedSoftWrap: true,
    printMargin: false,
    wrapBehavioursEnabled: true,
  };
  ref: firebase.database.Reference;
  timeAgo;
  users: Array<{ color: string, alias: string, name: string, userId: string }>;

  constructor(
    private titleService: Title,
  ) {
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

  get title() { return this._title; }
  set title(newTitle: string) {
    this.titleService.setTitle(`${newTitle} − Markdown Editor`);
    this._title = newTitle;
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
    this.firepad = Firepad.fromACE(this.ref, editor, {
      defaultText,
    });
    const onSync = () => this.resultString = this.md.render(this.firepad.getText());
    this.firepad.on('synced', onSync);
    this.firepad.on('ready', () => {
      this.loaded = true;
      onSync();
      editor.resize(true);
    });

    this.ref.child('metadata').once('value')
      .then(snapshot => snapshot.val())
      .then((val) => {
        if (val && 'title' in val) {
          this.title = val.title;
        }
      });

    this.ref.child('history')
      .orderByChild('t')
      .limitToLast(1)
      .on('child_added', snapshot => {
        const timestamp = snapshot.val().t;
        this.lastModified = new Date(timestamp);
    });

    this.ref.child('users')
      .on('value', snapshot => {
        const users = snapshot.val();
        const objToNumber = obj => JSON.stringify(obj)
          .split('')
          .reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const colorList = Object.keys(this.colors);
        const colorNameFromObject = color => {
          const number = objToNumber(color) % colorList.length;
          return colorList[number];
        };
        const emojiList = Object.keys(this.emojis);
        const emojiFromColor = (color, offset = 0) => {
          const number = (objToNumber(color) + offset) % emojiList.length;
          return emojiList[number];
        };
        const imageFromEmoji = someEmoji => twemoji.parse(someEmoji);
        this.users = Object.entries<{ color: string }>(users)
        .map(([userId], i) => {
          const newColor = colorNameFromObject(userId);
          const someEmoji = emojiFromColor(newColor, i);
          return {
            userId,
            color: this.colors[newColor],
            alias: imageFromEmoji(someEmoji),
            name: newColor + ' ' + this.emojis[someEmoji],
          };
        });
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

  openNewDocument() {
    const url = window.location.href.split('#')[0];
    window.open(url, '_blank');
  }

  print() {
    window.print();
  }
}
