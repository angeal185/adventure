const vkey = require('./vkey'),
events = require('events');

let game;

function Fly(physical, noKeyEvents) {
  this.flySpeed = 0.8
  this.physical = physical
  if (!noKeyEvents){
    this.bindKeyEvents();
  }
}

Fly.prototype = {
  bindKeyEvents(el) {
    if (!el) el = document.body
    var self = this
    var counter = 0
    var spaceUpAfterFirstDown = false
    var first = Date.now()
    el.addEventListener('keydown', onKeyDown);
    el.addEventListener('keyup', onKeyUp);

    function onKeyDown(ev) {
      var key = vkey[ev.keyCode] || ev.char
      var binding = game.keybindings[key]
      if (binding !== "jump") return
      if (counter === 1) {
        if (Date.now() - first > 300) {
          spaceUpAfterFirstDown = false
          return first = Date.now()
        } else {
          if (!self.flying && spaceUpAfterFirstDown) {
            self.startFlying()
          }
        }
        spaceUpAfterFirstDown = false
        return counter = 0
      }
      if (counter === 0) {
        first = Date.now()
        counter += 1
      }
    }

    function onKeyUp(ev) {
      var key = vkey[ev.keyCode] || ev.char
      if (key === '<space>' && counter === 1) {
        spaceUpAfterFirstDown = true
      }
    }
  },
  startFlying() {
    var self = this
    this.flying = true
    var physical = this.physical
    physical.removeForce(game.gravity)
    physical.onGameTick = function(dt) {
      if (physical.atRestY() === -1) return self.stopFlying()
      physical.friction.x = self.flySpeed
      physical.friction.z = self.flySpeed
      var press = game.controls.state
      if (press['crouch']) return physical.velocity.y = -0.01
      if (press['jump']) return physical.velocity.y = 0.01
      physical.velocity.y = 0
    }
    game.on('tick', physical.onGameTick)
  },
  stopFlying() {
    this.flying = false
    var physical = this.physical
    physical.subjectTo(game.gravity)
    game.removeListener('tick', physical.onGameTick)
  }
}


module.exports = function(gameInstance) {
  game = gameInstance
  return function makeFly(physical, noKeyEvents) {
    return new Fly(physical, noKeyEvents)
  }
}
