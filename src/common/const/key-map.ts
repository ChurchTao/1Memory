import { Key } from 'ts-key-enum'

export const FuncKeyShow = {
  mac: {
    command: '⌘',
    meta: '⌘',
    shift: '⇧',
    option: '⌥',
    alt: '⌥',
    control: '⌃',
    enter: '↵',
    backspace: '⌫',
    delete: '⌦',
    left: '←',
    right: '→',
    up: '↑',
    down: '↓'
  },
  windows: {
    control: 'Ctrl',
    shift: 'Shift',
    alt: 'Alt',
    command: 'Win',
    enter: '↵',
    backspace: '⌫',
    delete: '⌦',
    left: '←',
    right: '→',
    up: '↑',
    down: '↓'
  }
}

// Special Keys
export const specialKeyCodeNameMap = {
  8: Key.Backspace,
  9: Key.Tab,
  12: Key.Clear,
  13: Key.Enter,
  27: Key.Escape,
  32: 'Space',
  37: Key.ArrowLeft,
  38: Key.ArrowUp,
  39: Key.ArrowRight,
  40: Key.ArrowDown,
  46: Key.Delete,
  45: Key.Insert,
  36: Key.Home,
  35: Key.End,
  33: Key.PageUp,
  34: Key.PageDown,
  20: Key.CapsLock,
  96: '0',
  97: '1',
  98: '2',
  99: '3',
  100: '4',
  101: '5',
  102: '6',
  103: '7',
  104: '8',
  105: '9',
  108: Key.Enter,
  109: Key.Subtract,
  110: Key.Decimal,
  111: Key.Divide,
  188: ',',
  190: '.',
  191: '/',
  192: '`',
  189: '-',
  187: '=',
  186: ';',
  222: "'",
  219: '[',
  221: ']',
  220: '\\'
}

export const modifierKeyCodeMap = {
  16: Key.Shift,
  18: Key.Alt,
  17: Key.Control,
  91: Key.Meta
}
