const EE = require('events').EventEmitter,
_raf = window.requestAnimationFrame;


function raf(el) {
  let now = raf.now(),
  evt = new EE

  evt.pause = function() {
    evt.paused = true
  }

  evt.resume = function() {
    evt.paused = false
  }

  _raf(iter, el)

  return evt

  function iter(timestamp) {
    let _now = raf.now(),
    dt = _now - now;

    now = _now

    evt.emit('data', dt)

    if (!evt.paused) {
      _raf(iter, el)
    }
  }
}

raf.now = function() {
  return Date.now()
}

module.exports = raf
