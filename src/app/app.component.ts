import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as firebase from 'firebase/app';
import 'firebase/database';
import hljs from 'highlight.js';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import * as MarkdownIt from 'markdown-it';
import * as emoji from 'markdown-it-emoji';
import { CodemirrorComponent } from 'ng2-codemirror';
import dedent from 'ts-dedent';
import * as twemoji from 'twemoji';
import * as Firepad from '../libs/firepad/dist/firepad';
import { MenuComponent } from './menu/menu.component';
TimeAgo.locale(en);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(MenuComponent) menu: MenuComponent;
  @ViewChild(CodemirrorComponent) cm: CodemirrorComponent;
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
    'Monkey': '🐒',
    'Chicken': '🐤',
    'Duck': '🦆',
    'Owl': '🦉',
    'Bat': '🦇',
    'Unicorn': '🦄',
    'Butterfly': '🦋',
    'Octopus': '🐙',
    'Spider': '🕷',
    'Whale': '🐳',
    'Rat': '🐀',
    'Lizard': '🦎',
  };
  codemirrorConfig = {
    mode: {
      name: 'gfm',
    },
    tabSize: 2,
    autofocus: true,
    theme: 'default',
    lineWrapping: true,
  };
  firepad;
  md: MarkdownIt.MarkdownIt;
  lastModified;
  loaded = false;
  _title = '';
  resultString: string;
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
    const emojiToImage = (tokens, idx) => twemoji.parse(tokens[idx].content);
    this.md.renderer.rules.emoji = emojiToImage;
    const originalLinkRenderer = this.md.renderer.rules.link_open || ((tokens, idx, options, env, self) => {
      return self.renderToken(tokens, idx, options);
    });
    this.md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      tokens[idx].attrPush(['target', '_blank']);
      return originalLinkRenderer(tokens, idx, options, env, self);
    };
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
    const defaultText = dedent`# New document

    This is an _online_ **Markdown** editor :v:.

    Have some fun. Here you have a [Markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) ;).

    > Made with <3 from :chile:

    `;
    const codemirrorInstance = this.cm.instance;
    this.menu.cm = codemirrorInstance;
    const config = {
      apiKey: 'AIzaSyBK7k4vLvjRfJ2DOfzouMNAAgj9jwhQc4Y',
      authDomain: 'markdown-editor-8412c.firebaseapp.com',
      databaseURL: 'https://markdown-editor-8412c.firebaseio.com',
    };
    firebase.initializeApp(config);

    this.ref = this.getRef();
    this.firepad = Firepad.fromCodeMirror(this.ref, codemirrorInstance, {
      defaultText,
    });
    const onSync = () => this.resultString = this.md.render(this.firepad.getText());
    this.firepad.on('synced', onSync);
    this.firepad.on('ready', () => {
      this.loaded = true;
      onSync();
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
        const users: Array<{ color: string }> = snapshot.val();

        const colorNameList = Object.keys(this.colors);
        const emojiNameList = Object.keys(this.emojis);

        const objToNumber = obj => JSON.stringify(obj).split('')
          .map(c => c.charCodeAt(0))
          .reduce((acc, n) => acc + n, 0);

        const colorNameFromObject = color =>
          colorNameList[objToNumber(color) % colorNameList.length];

        const emojiNameFromColor = (color, offset = 0) =>
          emojiNameList[(objToNumber(color) + offset) % emojiNameList.length];

        const imageFromEmoji = twemoji.parse;

        this.users = Object.entries(users)
        .map(([userId], i) => {
          const colorName = colorNameFromObject(userId);
          const color = this.colors[colorName];
          const emojiName = emojiNameFromColor(colorName, i);
          const alias = imageFromEmoji(this.emojis[emojiName]);
          const name = colorName + ' ' + emojiName;
          return { userId, color, alias, name };
        });
      });
  }

  onInputClicked({ target }) {
    if (this.title) { return; }
    const firstLine = this.resultString.split('\n', 1)[0].replace(/>(.*)</, '$1');
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
