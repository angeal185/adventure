const vkey = require('./vkey'),
events = require('events');

let game;

function Fly(physical) {
  this.flySpeed = 0.8
  this.physical = physical
}

Fly.prototype = {
  startFlying() {
    var self = this
    this.flying = true
    var physical = this.physical
    physical.removeForce(game.gravity)
    physical.onGameTick = function(dt) {
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
