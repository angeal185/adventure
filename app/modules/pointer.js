const EE = require('events').EventEmitter,
Stream = require('stream').Stream

function pointer(el) {
  var ael = el.addEventListener,
    rel = el.removeEventListener,
    doc = el.ownerDocument,
    body = doc.body,
    rpl = shim(el),
    out = {
      dx: 0,
      dy: 0,
      dt: 0
    },
    ee = new EE,
    stream = null,
    lastPageX, lastPageY, needsFullscreen = false,
    mouseDownMS

  ael.call(el, 'mousedown', onmousedown, false)
  ael.call(el, 'mouseup', onmouseup, false)
  ael.call(body, 'mousemove', onmove, false)
  ael.call(doc, 'pointerlockchange', onpointerlockchange)
  ael.call(doc, 'pointerlockerror', onpointerlockerror)


  ee.release = release
  ee.target = pointerlockelement
  ee.request = onmousedown
  ee.destroy = function() {
    rel.call(el, 'mouseup', onmouseup, false)
    rel.call(el, 'mousedown', onmousedown, false)
    rel.call(el, 'mousemove', onmove, false)
  }

  if (!shim) {
    setTimeout(function() {
      ee.emit('error', new Error('pointer lock is not supported'))
    }, 0)
  }
  return ee

  function onmousedown(ev) {
    if (pointerlockelement()) {
      return
    }
    mouseDownMS = +new Date
    rpl.call(el)
  }

  function onmouseup(ev) {
    if (!needsFullscreen) {
      return
    }

    ee.emit('needs-fullscreen')
    needsFullscreen = false
  }

  function onpointerlockchange(ev) {
    if (!pointerlockelement()) {
      if (stream) release()
      return
    }

    stream = new Stream
    stream.readable = true
    stream.initial = {
      x: lastPageX,
      y: lastPageY,
      t: Date.now()
    }

    ee.emit('attain', stream)
  }

  function onpointerlockerror(ev) {
    var dt = +(new Date) - mouseDownMS
    if (dt < 100) {
      // we errored immediately, we need to do fullscreen first.
      needsFullscreen = true
      return
    }

    if (stream) {
      stream.emit('error', ev)
      stream = null
    }
  }

  function release() {
    ee.emit('release')

    if (stream) {
      stream.emit('end')
      stream.readable = false
      stream.emit('close')
      stream = null
    }

    var pel = pointerlockelement()
    if (!pel) {
      return
    }

    (doc.exitPointerLock).call(doc)
  }

  function onmove(ev) {
    lastPageX = ev.pageX
    lastPageY = ev.pageY

    if (!stream) return

    out.dx = ev.movementX || 0

    out.dy = ev.movementY || 0

    out.dt = Date.now() - stream.initial.t

    ee.emit('data', out)
    stream.emit('data', out)
  }

  function pointerlockelement() {
    return 0 || doc.pointerLockElement || null
  }
}

function shim(el) {
  return el.requestPointerLock || null
}

module.exports = pointer
