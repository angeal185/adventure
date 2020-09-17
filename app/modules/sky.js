const config = require('../data/config');

function Snow() {
  var self = this;
  if (!(this instanceof Snow)){
    return new Snow();
  }

  this.game = game;
  this.speed = config.snow.speed || 0.1;
  this.drift = config.snow.drift || 1;
  this.particles = [];
  this.material = new game.THREE.ParticleBasicMaterial({color: 0xffffff, size: 1})
  if (config.snow.count != null || config.snow.size != null || this.material != null) {
    this.game.scene.add(this.add(
      config.snow.count || null, config.snow.size || null, this.material || null
    ));
  }
}

Snow.prototype.add = function(count, size, material) {
  var game = this.game;
  count = count || 1000;
  size  = size  || 20;
  material = material || new game.THREE.ParticleBasicMaterial({
    color: 0x9999ff,
    size: 1
  });

  var half = size / 2;

  var geom = new game.THREE.Geometry();
  geom.boundingBox = new game.THREE.Box3(
    new game.THREE.Vector3(-half, -half, -half),
    new game.THREE.Vector3(half, half, half)
  );

  for (var i = 0; i < count; i++) {
    geom.vertices.push(new game.THREE.Vector3(
      rand(-half, half), rand(-half, half), rand(-half, half)
    ));
  }

  var particles = new game.THREE.ParticleSystem(geom, material);
  this.particles.push(particles);

  return particles;
};

Snow.prototype.tick = function() {
  let self = this,
  target = self.game.controls.target();
  self.particles.forEach(function(particle) {
    if (target === null){
      return;
    }

    let pos = target.position;
    particle.position.copy({x:pos.x, y: 1, z:pos.z});

    let bounds = particle.geometry.boundingBox,
    count = particle.geometry.vertices.length,
    a = target.yaw.rotation.y,
    x = Math.floor(target.velocity.x * 1000) / 50,
    y = Math.floor(target.velocity.y * 1000) / 50,
    z = Math.floor(target.velocity.z * 1000) / 50;
    // todo: fix this, should handle 2 directions at the same time
    var r = x !== 0 ? x * 0.5 : z !== 0 ? z : 0;
    if (x !== 0) a += Math.PI / 2;
    while (count--) {
      let p = particle.geometry.vertices[count];

      if (p.y < bounds.min.y || p.y < 0){
        p.y = bounds.max.y;
      }
      p.y -= Math.random() * (self.speed + y / 2);
      ['x', 'z'].forEach(function(x) {
        if (p[x] > bounds.max[x] || p[x] < bounds.min[x]) {
         p[x] = rand(bounds.min[x], bounds.max[x]);
        }
      });
      p.x += Math.sin(a) * -r * self.drift;
      p.z += Math.cos(a) * -r * self.drift;
    }
    particle.geometry.verticesNeedUpdate = true;
  });
};

function Stars() {
  var self = this;
  if (!(this instanceof Stars)){
    return new Stars();
  }

  this.game = game;
  this.particles = [];
  this.material = new game.THREE.ParticleBasicMaterial({color: 0xffffff, size: 1})
  if (config.stars.count != null || config.stars.size != null || this.material != null) {
    this.game.scene.add(this.add(
      config.stars.count || null, config.stars.size || null, this.material || null
    ));
  }
}

Stars.prototype.add = function(count, size, material) {
  var game = this.game;
  count = count || 10000;
  size  = size  || 0.1;
  material = material || new game.THREE.ParticleBasicMaterial({
    color: 0xffffff,
    size: 1
  });

  var half = size / 2;

  var geom = new game.THREE.Geometry();
  geom.boundingBox = new game.THREE.Box3(
    new game.THREE.Vector3(-half, 3, -half),
    new game.THREE.Vector3(half, 10, half)
  );


  for (var i = 0; i < count; i++) {
    geom.vertices.push(new game.THREE.Vector3(
      rand(-half, half),rand(3, 10), rand(-half, half)
    ));
  }

  var particles = new game.THREE.ParticleSystem(geom, material);
  this.particles.push(particles);

  return particles;
};

Stars.prototype.tick = function() {

    let self = this,
    target = self.game.controls.target();
    self.particles.forEach(function(particle) {
      if (target == null){
        return;
      }
      particle.position.copy(target.position);

      let bounds = particle.geometry.boundingBox,
      count = particle.geometry.vertices.length,
      y = target.velocity.y;

      while (count--) {
        var p = particle.geometry.vertices[count];
        if (p.y > bounds.max.y) {
          p.y = bounds.min.y;
        }
        p.y+= 0.00002
      }

      particle.geometry.verticesNeedUpdate = true;
    });
  
};

function rand(min, max) { return Math.random() * (max - min) + min; }

const snow = new Snow()
const stars = new Stars()

module.exports = { snow, stars };
