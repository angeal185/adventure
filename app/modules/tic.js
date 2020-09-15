var now = (function() {
  var p = window.performance || Object.create(null);
  return function() {
    var n = p.now || function() { return (new Date()).getTime() };

    return n.call(p);
  }
}());

function Tic() {
  this._things = [];
  this._dt = -1;
}

Tic.prototype = {
  _stack(thing) {
    var self = this;
    self._things.push(thing);
    var i = self._things.length - 1;
    return function() { delete self._things[i]; }
  },
  interval(fn, at) {
    return this._stack({
      fn: fn, at: at, args: Array.prototype.slice.call(arguments, 2),
      elapsed: 0, once: false
    });
  },
  timeout(fn, at) {
    return this._stack({
      fn: fn, at: at, args: Array.prototype.slice.call(arguments, 2),
      elapsed: 0, once: true
    });
  },
  tick(dt) {
    var self = this;
    if (arguments.length < 1) {
      var t = now()
      if (this._dt < 0) this._dt = t
      dt = t - this._dt
      this._dt = t
    }
    self._things.forEach(function(thing, i) {
      thing.elapsed += dt;
      if (thing.elapsed > thing.at) {
        thing.elapsed -= thing.at;
        thing.fn.apply(thing.fn, thing.args || []);
        if (thing.once) {
          delete self._things[i];
        }
      }
    });
  }
}

const tic = new Tic();

module.exports = tic;
