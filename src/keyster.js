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
    , timeout
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

    if (selectors[keyster.scope].length === 0) {
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

    var sequences = selectors[keyster.scope];

    for (var a = 0; a < sequences.length; a++) {
      var matches = 0
        , total = 0
        , combos = sequences[a].combos;

      for (var b = 0; b < combos.length; b++) {
        var combo = combos[b];

        total += combo.length;

        for (var c = 0; c < sequence.length; c++) {
          var seq = sequence[c];

          for (var d = 0; d < seq.length; d++) {
            var seqKey = seq[d];

            if (combo.indexOf(seqKey) !== -1) {
              matches++;
            }
          }
        }
      }

      if (matches === total && sequences[a].fn(e) === false) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  function cleanup(e) {
    timeout = setTimeout(function() {
      var combo = currentSequenceCombo();

      if (combo) {
        combo.splice(combo.indexOf(keyster.which(e)), 1);
      }
    }, keyster.timeout);
  }

  function trigger(parsed) {
    for (var a = 0; a < parsed.length; a++) {
      for (var b = 0; b < parsed[a].combos.length; b++) {
        for (var c = 0; c < parsed[a].combos[b].length; c++) {
          triggerEvent('keydown', parsed[a].combos[b][c]);
        }

        for (var c = 0; c < parsed[a].combos[b].length; c++) {
          triggerEvent('keyup', parsed[a].combos[b][c]);
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

    for (var a = 0; a < arr2.length; a++) {
      if (arr1.indexOf(arr2[a]) === -1) {
        return false;
      }
    }

    return true;
  }

  function parse(keys, scope, fn) {
    var parsed = []
      , combos = keys.split(splitters.combo);

    for (var a = 0; a < combos.length; a++) {
      var combo = []
        , seqs = combos[a].split(splitters.seq);

      for (var b = 0; b < seqs.length; b++) {
        var seq = []
          , cmds = seqs[b].split(splitters.cmd);

        for (var c = 0; c < cmds.length; c++) {
          seq.push(keyster.code(cmds[c]));
        }

        combo.push(seq);
      }

      parsed.push({
        combos: combo,
        fn: fn
      });
    }

    return parsed;
  };

  function currentSequenceCombo() {
    return sequence[(sequence.length || 1) - 1];
  }

  function triggerEvent(name, code) {
    var names = keyster.map[code]
      , e = {
        bubbles: true,
        cancelable: true,
        currentTarget: document,
        target: document,
        timestamp: new Date().getTime(),
        type: name,

        altKey: names[0] === 'option',
        char: names[0],
        ctrlKey: names[0] === 'control',
        key: code,
        locale: '',
        meta: names[0] === 'command',
        repeat: false,
        shiftKey: names[0] === 'shift',

        preventDefault: function(){},
        stopPropagation: function(){}
      };

    if (name === 'keydown') {
      return dispatch(e);
    }

    if (name === 'keyup') {
      return cleanup(e);
    }
  }

  function bindEvent(e, fn) {
    if (document.addEventListener) {
      document.addEventListener(e, fn, false);
    } else {
      document.attachEvent('on' + e, function() {
        fn(window.event)
      });
    }
  }


  bindEvent('keydown', dispatch);
  bindEvent('keyup', cleanup);


  keyster = function(keys, scope, fn) {
    if (arguments.length === 2) {
      fn = scope;
      scope = keyster.scope;
    } else if (arguments.length === 1) {
      scope = keyster.scope;
    }

    if (typeof selectors[scope] === 'undefined') {
      selectors[scope] = [];
    }

    var parsed = parse(keys, scope, fn);

    if (fn) {
      [].push.apply(selectors[scope], parsed);
    } else {
      trigger(parsed);
    }

    return keyster;
  };

  keyster.attr = 'data-scope';
  keyster.scope = 'all';
  keyster.timeout = 500;

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

  keyster.clean = function() {
    selectors = {};
    sequence = [];
    return keyster;
  };

  keyster.which = function(e) {
    return e.key || e.which || e.keyCode;
  };

  keyster.filter = function(e) {
    var el = e.target || e.srcElement
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