!function(factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    keyster = factory();
  }
}(function() {

  var keyster
    , sequenceTimeout
    , sequenceTimeoutMs = 500
    , selectors = {}
    , sequence = []
    , splitters = {
        combo: /\s*\,\s*/,
        seq: /\s*\>\s*/,
        cmd: /\s*\+\s*/
      };


  function dispatch(e) {
    if (typeof selectors[keyster.scope] === 'undefined') {
      return;
    }

    if (keyster.filter(e) === false) {
      return;
    }

    var combo = currentSequenceCombo()
      , code = keyster.which(e);

    if (combo) {
      if (combo.indexOf(code) === -1) {
        combo.push(code);
      } else {
        return;
      }
    } else {
      sequence.push([code]);
    }

    for (var a = 0; a < selectors[keyster.scope].length; a++) {
      for (var b = 0; b < selectors[keyster.scope][a].length; b++) {
        for (var c = 0; c < selectors[keyster.scope][a][b].cmds.length; c++) {
          for (var d = 0; d < sequence.length; d++) {
            if (compare(selectors[keyster.scope][a][b].cmds, sequence[d])) {
              if (selectors[keyster.scope][a][b].fn(e) === false) {
                e.preventDefault();
                e.stopPropagation();
              }
            }
          }
        }
      }
    }
  }

  function compare(arr1, arr2) {
    for (var a = 0; a < arr1.length; a++) {
      if (arr2.indexOf(arr1[a]) === -1) {
        return false;
      }
    }

    return true;
  }

  function parse(keys, scope, fn) {
    var combos = keys.split(splitters.combo);

    if (typeof selectors[scope] === 'undefined') {
      selectors[scope] = [];
    }

    for (var a = 0; a < combos.length; a++) {
      var combo = []
        , seqs = combos[a].split(splitters.seq);

      for (var b = 0; b < seqs.length; b++) {
        var seq = []
          , cmds = seqs[b].split(splitters.cmd);

        for (var c = 0; c < cmds.length; c++) {
          seq.push(keyster.code(cmds[c]));
        }

        combo.push({
          cmds: seq,
          fn: fn
        });
      }

      selectors[scope].push(combo);
    }
  };

  function currentSequenceCombo() {
    return sequence[(sequence.length || 1) - 1];
  }


  document.addEventListener('keydown', dispatch);
  document.addEventListener('keyup', function(e) {
    sequenceTimeout = setTimeout(function() {
      var combo = currentSequenceCombo();

      if (combo) {
        combo.splice(combo.indexOf(keyster.which(e)), 1);
      }
    }, sequenceTimeoutMs);
  });


  keyster = function(keys, scope, fn) {
    if (arguments.length === 2) {
      fn = scope;
      scope = keyster.scope;
    }

    parse(keys, scope, fn);

    return keyster;
  };

  keyster.attr = 'data-scope';

  keyster.scope = 'all';

  keyster.map = {
    8: ['backspace', 'back'],
    9: ['tab'],
    13: ['enter', 'return', 'ret'],
    16: ['shift'],
    17: ['control', 'ctrl'],
    18: ['option', 'alt'],
    19: ['pause', 'break'],
    20: ['capslock', 'caps'],
    27: ['escape', 'esc'],
    33: ['pageup'],
    34: ['pagedown'],
    35: ['end'],
    36: ['home'],
    37: ['left'],
    38: ['up'],
    39: ['right'],
    40: ['down'],
    45: ['insert', 'ins'],
    46: ['delete', 'del'],
    48: ['0'],
    49: ['1'],
    50: ['2'],
    51: ['3'],
    52: ['4'],
    53: ['5'],
    54: ['6'],
    55: ['7'],
    56: ['8'],
    57: ['9'],
    65: ['a', 'A'],
    66: ['b', 'B'],
    67: ['c', 'C'],
    68: ['d', 'D'],
    69: ['e', 'E'],
    70: ['f', 'F'],
    71: ['g', 'G'],
    72: ['h', 'H'],
    73: ['i', 'I'],
    74: ['j', 'J'],
    75: ['k', 'K'],
    76: ['l', 'L'],
    77: ['m', 'M'],
    78: ['n', 'N'],
    79: ['o', 'O'],
    80: ['p', 'P'],
    81: ['q', 'Q'],
    82: ['r', 'R'],
    83: ['s', 'S'],
    84: ['t', 'T'],
    85: ['u', 'U'],
    86: ['v', 'V'],
    87: ['w', 'W'],
    88: ['x', 'X'],
    89: ['y', 'Y'],
    90: ['z', 'Z'],
    91: ['command', 'cmd', 'window', 'win'],
    92: ['command', 'cmd', 'window', 'win'],
    93: ['command', 'cmd', 'window', 'win'],
    96: ['numpad0'],
    97: ['numpad1'],
    98: ['numpad2'],
    99: ['numpad3'],
    100: ['numpad4'],
    101: ['numpad5'],
    102: ['numpad6'],
    103: ['numpad7'],
    104: ['numpad8'],
    105: ['numpad9'],
    106: ['multiply', 'times'],
    107: ['plus', 'add'],
    109: ['minus', 'subtract', 'sub'],
    110: ['decimal', 'dec', 'point'],
    111: ['divide', 'div'],
    112: ['f1'],
    113: ['f2'],
    114: ['f3'],
    115: ['f4'],
    116: ['f5'],
    117: ['f6'],
    118: ['f7'],
    119: ['f8'],
    120: ['f9'],
    121: ['f10'],
    122: ['f11'],
    123: ['f12'],
    144: ['numlock', 'num'],
    145: ['scrolllock', 'scroll'],
    186: ['semicolon', 'semi'],
    187: ['equals', 'eq'],
    188: ['comma'],
    189: ['dash'],
    190: ['period', 'dot', 'fullstop'],
    191: ['forwardslash'],
    192: ['backtick'],
    219: ['openbracket'],
    220: ['backslash'],
    221: ['closebracket'],
    222: ['singlequote']
  };

  keyster.code = function(name) {
    for (var a in keyster.map) {
      if (keyster.map[a].indexOf(name) > -1) {
        return +a;
      }
    }
  };

  keyster.which = function(e) {
    return e.which || e.keyCode;
  };

  keyster.filter = function(e) {
    var el = event.target || event.srcElement
      , isInput = ['INPUT', 'SELECT', 'TEXTAREA'].indexOf(el.tagName) > -1
      , oldScope = keyster.scope
      , newScope = el.getAttribute ? el.getAttribute(keyster.attr) : false;

    if (newScope && isInput) {
      if (oldScope !== newScope) {
        var restoreScope = function() {
          keyster.scope = oldScope;

          el.removeEventListener('blur', restoreScope);
        };

        keyster.scope = newScope;

        el.addEventListener('blur', restoreScope);
      }

      return true;
    }

    return !isInput;
  };


  return keyster;

});