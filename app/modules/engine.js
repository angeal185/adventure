const voxel = require('./voxel'),
voxelMesh = require('./mesh'),
ray = require('./raycast'),
texture = require('./texture'),
control = require('./control'),
voxelView = require('./view'),
THREE = require('./three'),
Stats = require('./lib/stats'),
Detector = require('./lib/detector'),
EventEmitter = require('events').EventEmitter,
aabb = require('./aabb-3d'),
glMatrix = require('./lib/gl-matrix'),
vector = glMatrix.vec3,
SpatialEventEmitter = require('./spatial-events'),
kb = require('./kb-controls'),
physical = require('./physical'),
tic = require('./tic'),
utils = require('../utils'),
config = require('../data/config');

let opts = config.defaults;

function Game() {

  if (!(this instanceof Game)){
    return new Game()
  }

  let self = this;

  this.gravity = opts.gravity;
  this.terminalVelocity = opts.terminalVelocity;
  this.generateChunks = opts.generateChunks;

  this.configureChunkLoading(opts);
  this.setDimensions(opts);
  this.THREE = THREE;
  this.vector = vector;
  this.glMatrix = glMatrix;

  this.cubeSize = 1;
  this.chunkSize = opts.chunkSize;
  this.chunkDistance = opts.chunkDistance;
  this.removeDistance = opts.removeDistance;
  this.skyColor = opts.skyColor;

  this.mesher = voxel.meshers.culled
  this.materialType = opts.materialType || THREE.MeshLambertMaterial
  this.materialParams = opts.materialParams || {}
  this.items = [];
  this.voxels = voxel(this)
  this.scene = new THREE.Scene()
  this.view = new voxelView(THREE, Object.assign(opts,{ width: this.width, height: this.height }))
  this.view.bindToScene(this.scene)
  this.camera = this.view.getCamera()
  if (!opts.lightsDisabled) {
    this.addLights(this.scene)
  }

  if(!opts.fogDisabled){
    let scene = this.scene;
    this.scene.fog = new THREE.Fog(opts.fogColor, 0.00025, opts.fogScale );
    window.fogChange = function(evt){
      scene.fog.color.setHex(evt)
    }
  }

  this.collideVoxels = utils.collisions(
    this.getBlock.bind(this),
    1,
    [Infinity, Infinity, Infinity],
    [-Infinity, -Infinity, -Infinity]
  )

  this.timer = this.initializeTimer(opts.tickFPS)
  this.paused = false

  this.spatial = new SpatialEventEmitter
  this.region = this.coordinates(this.spatial, aabb([0, 0, 0], [1, 1, 1]), opts.chunkSize)
  this.voxelRegion = this.coordinates(this.spatial, 1)
  this.chunkRegion = this.coordinates(this.spatial, opts.chunkSize)

  // contains chunks that has had an update this tick. Will be generated right before redrawing the frame
  this.chunksNeedsUpdate = {}
  // contains new chunks yet to be generated. Handled by game.loadPendingChunks
  this.pendingChunks = []

  this.materials = texture({
    game: this,
    texturePath: opts.texturePath,
    materialType: opts.materialType || THREE.MeshLambertMaterial,
    materialParams: opts.materialParams || {},
    materialFlatColor: opts.materialFlatColor === true
  })

  this.setInterval = tic.interval.bind(tic);
  this.setTimeout = tic.timeout.bind(tic);

  //this.materialNames = opts.materials;

  self.chunkRegion.on('change', function(newChunk) {
    self.removeFarChunks();
  })

  this.materials.load(opts.materials)

  if (this.generateChunks){
    this.handleChunkGeneration();
  }

  //this.paused = true
  this.initializeRendering()

  for(var chunkIndex in this.voxels.chunks){
    this.showChunk(this.voxels.chunks[chunkIndex])
  }

  setTimeout(function() {
    self.asyncChunkGeneration = 'asyncChunkGeneration' in opts ? opts.asyncChunkGeneration : true
  }, 2000)

  this.initializeControls();
}


// # External API
Game.prototype = {
  voxelPosition(gamePosition) {
    let p = gamePosition,
    v = [];
    v[0] = Math.floor(p[0])
    v[1] = Math.floor(p[1])
    v[2] = Math.floor(p[2])
    return v
  },
  cameraPosition() {
    return this.view.cameraPosition()
  },
  cameraVector() {
    return this.view.cameraVector()
  },
  makePhysical(target, envelope, blocksCreation) {
    let vel = this.terminalVelocity
    envelope = envelope || [2/3, 1.5, 2/3]
    let obj = physical(target, this.potentialCollisionSet(), envelope, {x: vel[0], y: vel[1], z: vel[2]})
    obj.blocksCreation = !!blocksCreation
    return obj
  },
  addItem(item) {
    if (!item.tick) {
      let newItem = physical(
        item.mesh,
        this.potentialCollisionSet(),
        [item.size, item.size, item.size]
      )

      if (item.velocity) {
        newItem.velocity.copy(item.velocity)
        newItem.subjectTo(opts.gravity)
      }

      newItem.repr = function() { return 'debris' }
      newItem.mesh = item.mesh
      newItem.blocksCreation = item.blocksCreation

      item = newItem
    }

    this.items.push(item)
    if (item.mesh){
      this.scene.add(item.mesh);
    }
    return this.items[this.items.length - 1];
  },
  removeItem(item) {
    let ix = this.items.indexOf(item);
    if (ix < 0){
      return;
    }
    this.items.splice(ix, 1);
    if (item.mesh){
      this.scene.remove(item.mesh)
    }
  },
  raycastVoxels(start, direction, maxDistance, epilson) {
    if (!start){
      return this.raycastVoxels(this.cameraPosition(), this.cameraVector(), 10);
    }

    let hitNormal = [0, 0, 0],
    hitPosition = [0, 0, 0],
    cp = start || this.cameraPosition(),
    cv = direction || this.cameraVector(),
    hitBlock = ray(this, cp, cv, maxDistance || 10.0, hitPosition, hitNormal, epilson || opts.epilson);

    if (hitBlock <= 0){
      return false;
    }

    let adjacentPosition = [0, 0, 0],
    voxelPosition = this.voxelPosition(hitPosition);
    vector.add(adjacentPosition, voxelPosition, hitNormal);

    return {
      position: hitPosition,
      voxel: voxelPosition,
      direction: direction,
      value: hitBlock,
      normal: hitNormal,
      adjacent: adjacentPosition
    }
  },
  canCreateBlock(pos) {
    pos = this.parseVectorArguments(arguments)
    let floored = pos.map(function(i) { return Math.floor(i) }),
    bbox = aabb(floored, [1, 1, 1]);

    for (var i = 0, len = this.items.length; i < len; ++i) {
      let item = this.items[i],
      itemInTheWay = item.blocksCreation && item.aabb && bbox.intersects(item.aabb())
      if (itemInTheWay){
        return false;
      }
    }

    return true;
  },
  createBlock(pos, val) {
    if(typeof val === 'string'){
      val = this.materials.find(val);
    }
    if(!this.canCreateBlock(pos)){
      return false;
    }
    this.setBlock(pos, val)
    return true;
  },
  setBlock(pos, val) {
    if (typeof val === 'string') {
      val = this.materials.find(val)
    }

    let old = this.voxels.voxelAtPosition(pos, val),
    c = this.voxels.chunkAtPosition(pos),
    chunk = this.voxels.chunks[c.join('|')];
    if(!chunk){
      return;
    }
    this.addChunkToNextUpdate(chunk)
    this.spatial.emit('change-block', pos, old, val)
    this.emit('setBlock', pos, val, old)
  },
  getBlock(pos) {
    pos = this.parseVectorArguments(arguments)
    return this.voxels.voxelAtPosition(pos)
  },
  blockPosition(pos) {
    pos = this.parseVectorArguments(arguments)
    return [Math.floor(pos[0]), Math.floor(pos[1]), Math.floor(pos[2])]
  },
  blocks(low, high, iterator) {
    let l = low,
    h = high,
    d = [ h[0]-l[0], h[1]-l[1], h[2]-l[2] ],
    i = 0;
    if (!iterator){
      var voxels = new opts.arrayType(d[0]*d[1]*d[2])
    }

    for(var z=l[2]; z<h[2]; ++z)
    for(var y=l[1]; y<h[1]; ++y)
    for(var x=l[0]; x<h[0]; ++x, ++i) {
      if (iterator){
        iterator(x, y, z, i);
      } else {
        voxels[i] = this.voxels.voxelAtPosition([x, y, z]);
      }
    }
    if (!iterator){
      return {voxels: voxels, dims: d}
    }
  },
  parseVectorArguments(args) {
    if(!args){
      return false;
    }
    if(args[0] instanceof Array){
      return args[0];
    }
    return [args[0], args[1], args[2]]
  },
  setDimensions(i) {
    if (i.container){
      this.container = i.container;
    }
    if (i.container && i.container.clientHeight) {
      this.height = i.container.clientHeight;
    } else {
      this.height = window.innerHeight
    }
    if (i.container && i.container.clientWidth) {
      this.width = i.container.clientWidth
    } else {
      this.width = window.innerWidth
    }
  },
  onWindowResize() {
    let width = window.innerWidth,
    height = window.innerHeight;

    if (this.container) {
      width = this.container.clientWidth
      height = this.container.clientHeight
    }

    this.view.resizeWindow(width, height)
  },
  control(target) {
    this.controlling = target
    return this.controls.target(target)
  },
  potentialCollisionSet() {
    return [{ collide: this.collideTerrain.bind(this) }]
  },
  playerPosition() {
    let target = this.controls.target(),
    position = target ? target.avatar.position : this.camera.localToWorld(this.camera.position.clone());
    return [position.x, position.y, position.z]
  },
  playerAABB(position) {
    let pos = position || this.playerPosition(),
    lower = [],
    upper = [1/2, opts.playerHeight, 1/2],
    playerBottom = [1/4, opts.playerHeight, 1/4];
    vector.subtract(lower, pos, playerBottom);

    return aabb(lower, upper);
  },
  collideTerrain(other, bbox, vec, resting) {
    var axes = ['x', 'y', 'z']
    var vec3 = [vec.x, vec.y, vec.z]
    this.collideVoxels(bbox, vec3, function hit(axis, tile, coords, dir, edge) {
      if (!tile) return
      if (Math.abs(vec3[axis]) < Math.abs(edge)) return
      vec3[axis] = vec[axes[axis]] = edge
      other.acceleration[axes[axis]] = 0
      resting[axes[axis]] = dir
      other.friction[axes[(axis + 1) % 3]] = other.friction[axes[(axis + 2) % 3]] = axis === 1 ? opts.friction  : 1
      return true
    })
  },
  addStats() {
    stats = new Stats()
    stats.domElement.style.position  = 'absolute'
    stats.domElement.style.bottom  = '0px'
    document.body.appendChild( stats.domElement )
  },
  addLights(scene) {
    let ambientLight = new THREE.AmbientLight(opts.ambientLight),
    light	= new THREE.DirectionalLight(...opts.directionalLight);

    light.position.set(...opts.lightPosition).normalize()
    light.intensity = 1;
    scene.add(ambientLight)
    scene.add( light )

    window.lightChange = function(evt){
      light.intensity = evt;
    }
  },
  configureChunkLoading(i) {
    let self = this;
    if (!i.generateChunks){
      return;
    }
    this.generate = utils.generate;
    this.generateVoxelChunk = function(low, high) {
      return voxel.generate(low, high, self.generate, self)
    }
  },
  worldWidth() {
    return opts.chunkSize * 2 * opts.chunkDistance;
  },
  chunkToWorld(pos) {
    return [
      pos[0] * opts.chunkSize,
      pos[1] * opts.chunkSize,
      pos[2] * opts.chunkSize
    ]
  },
  removeFarChunks(playerPosition) {
    playerPosition = playerPosition || this.playerPosition();
    let nearbyChunks = this.voxels.nearbyChunks(playerPosition, this.removeDistance).map(function(chunkPos) {
      return chunkPos.join('|');
    }),
    self = this;
    Object.keys(self.voxels.chunks).map(function(chunkIndex) {
      if(nearbyChunks.indexOf(chunkIndex) > -1){
        return
      }
      let chunk = self.voxels.chunks[chunkIndex],
      mesh = self.voxels.meshes[chunkIndex],
      pendingIndex = self.pendingChunks.indexOf(chunkIndex),
      chunkPosition;

      if(pendingIndex !== -1){
        self.pendingChunks.splice(pendingIndex, 1);
      }
      if(!chunk){
        return
      }

      chunkPosition = chunk.position;

      if(mesh){
        self.scene.remove(mesh[opts.meshType])
        mesh[opts.meshType].geometry.dispose()
        delete mesh.data
        delete mesh.geometry
        delete mesh.meshed
        delete mesh.surfaceMesh
      }
      delete self.voxels.chunks[chunkIndex]
      self.emit('removeChunk', chunkPosition)
    })
    self.voxels.requestMissingChunks(playerPosition)
  },
  addChunkToNextUpdate(chunk) {
    this.chunksNeedsUpdate[chunk.position.join('|')] = chunk;
  },
  updateDirtyChunks() {
    let self = this;
    Object.keys(this.chunksNeedsUpdate).forEach(function showChunkAtIndex(chunkIndex) {
      let chunk = self.chunksNeedsUpdate[chunkIndex];
      self.emit('dirtyChunkUpdate', chunk);
      self.showChunk(chunk);
    })
    this.chunksNeedsUpdate = {}
  },
  loadPendingChunks(count) {
    let pendingChunks = this.pendingChunks;

    if (!this.asyncChunkGeneration) {
      count = pendingChunks.length;
    } else {
      count = count || (pendingChunks.length * 0.1);
      count = Math.max(1, Math.min(count, pendingChunks.length));
    }

    for (var i = 0; i < count; i += 1) {
      let chunkPos = pendingChunks[i].split('|'),
      chunk = this.voxels.generateChunk(chunkPos[0]|0, chunkPos[1]|0, chunkPos[2]|0);
      this.showChunk(chunk);
    }

    if (count){
      pendingChunks.splice(0, count);
    }
  },
  getChunkAtPosition(pos) {
    let chunkID = this.voxels.chunkAtPosition(pos).join('|'),
    chunk = this.voxels.chunks[chunkID];
    return chunk;
  },
  showChunk(chunk) {
    let chunkIndex = chunk.position.join('|'),
    bounds = this.voxels.getBounds.apply(this.voxels, chunk.position),
    scale = new THREE.Vector3(1, 1, 1),
    mesh = voxelMesh(chunk, this.mesher, scale, this.THREE);

    this.voxels.chunks[chunkIndex] = chunk;

    if (this.voxels.meshes[chunkIndex]){
      this.scene.remove(this.voxels.meshes[chunkIndex][opts.meshType]);
    }

    this.voxels.meshes[chunkIndex] = mesh;


    if (opts.meshType === 'wireMesh'){
      mesh.createWireMesh();
    } else {
      mesh.createSurfaceMesh(this.materials.material);
    }

    this.materials.paint(mesh);

    mesh.setPosition(bounds[0][0], bounds[0][1], bounds[0][2]);
    mesh.addToScene(this.scene);
    this.emit('renderChunk', chunk);
    return mesh;
  },
  addMarker(position) {
    let geometry = new THREE.SphereGeometry( 0.1, 10, 10 ),
    material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ),
    mesh = new THREE.Mesh( geometry, material );

    mesh.position.copy(position)
    this.scene.add(mesh)
  },
  addAABBMarker(aabb, color) {
    let geometry = new THREE.CubeGeometry(aabb.width(), aabb.height(), aabb.depth()),
    material = new THREE.MeshBasicMaterial({ color: color || 0xffffff, wireframe: true, transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(aabb.x0() + aabb.width() / 2, aabb.y0() + aabb.height() / 2, aabb.z0() + aabb.depth() / 2);
    this.scene.add(mesh);
    return mesh;
  },
  addVoxelMarker(x, y, z, color) {
    let bbox = aabb([x, y, z], [1, 1, 1]);
    return this.addAABBMarker(bbox, color);
  },
  onControlChange(gained, stream) {
    this.paused = false;

    if (!gained && !this.optout) {
      this.buttons.disable();
      return;
    }

    this.buttons.enable();
    stream.pipe(this.controls.createWriteRotationStream());
  },
  onControlOptOut() {
    this.optout = true;
  },
  onFire(state) {
    this.emit('fire', this.controlling, state);
  },
  tick(delta) {
    for(var i = 0, len = this.items.length; i < len; ++i) {
      this.items[i].tick(delta);
    }

    if(this.materials) {
      this.materials.tick(delta);
    }

    if(this.pendingChunks.length){
      this.loadPendingChunks();
    }

    if(Object.keys(this.chunksNeedsUpdate).length > 0){
      this.updateDirtyChunks();
    }

    tic.tick(delta);

    this.emit('tick', delta);

    if(!this.controls){
      return;
    }

    var playerPos = this.playerPosition();
    this.spatial.emit('position', playerPos, playerPos);
  },
  render(delta) {
    this.view.render(this.scene);
  },
  initializeTimer(rate) {
    let self = this,
    accum = 0,
    now = 0,
    last = null,
    dt = 0,
    wholeTick;

    self.frameUpdated = true;
    self.interval = setInterval(timer, 0);
    return self.interval;

    function timer() {
      if (self.paused) {
        last = Date.now();
        accum = 0;
        return;
      }
      now = Date.now();
      dt = now - (last || now);
      last = now;
      accum += dt;
      if(accum < rate){
        return;
      }
      wholeTick = ((accum / rate)|0);
      if(wholeTick <= 0){
        return;
      }
      wholeTick *= rate;

      self.tick(wholeTick);
      accum -= wholeTick;

      self.frameUpdated = true;
    }
  },
  initializeRendering() {
    let self = this;

    if (!opts.statsDisabled){
      self.addStats();
    }

    window.addEventListener('resize', self.onWindowResize.bind(self), false)


    utils.raf(window).on('data', function(dt) {
      self.emit('prerender', dt);
      self.render(dt);
      self.emit('postrender', dt);
    })

    if (typeof stats !== 'undefined') {
      self.on('postrender', function() {
        stats.update();
      })
    }
  },
  initializeControls() {
    // player control
    this.keybindings = opts.keybindings;
    this.buttons = kb(document.body, this.keybindings);
    console.log()
    this.buttons.disable();
    this.optout = false;
    this.interact = utils.interact(opts.interactElement || this.view.element, opts.interactMouseDrag);
    this.interact
    .on('attain', this.onControlChange.bind(this, true))
    .on('release', this.onControlChange.bind(this, false))
    .on('opt-out', this.onControlOptOut.bind(this));
    this.hookupControls(this.buttons);
  },
  hookupControls(buttons) {
    opts.controls.onfire = this.onFire.bind(this);
    this.controls = control(buttons, opts.controls);
    this.items.push(this.controls);
    this.controlling = null;
  },
  handleChunkGeneration() {
    let self = this;
    this.voxels.on('missingChunk', function(chunkPos) {
      self.pendingChunks.push(chunkPos.join('|'));
    })
    this.voxels.requestMissingChunks(opts.worldOrigin);
    this.loadPendingChunks(this.pendingChunks.length);
  },
  destroy() {
    clearInterval(this.timer);
  },
  coordinates(spatial, box, regionWidth) {
    var emitter = new EventEmitter()
    var lastRegion = [NaN, NaN, NaN]
    var thisRegion

    if (arguments.length === 2) {
      regionWidth = box
      box = aabb([-Infinity, -Infinity, -Infinity], [Infinity, Infinity, Infinity])
    }

    spatial.on('position', box, updateRegion)

    function updateRegion(pos) {
      thisRegion = [Math.floor(pos[0] / regionWidth), Math.floor(pos[1] / regionWidth), Math.floor(pos[2] / regionWidth)]
      if (thisRegion[0] !== lastRegion[0] || thisRegion[1] !== lastRegion[1] || thisRegion[2] !== lastRegion[2]) {
        emitter.emit('change', thisRegion)
      }
      lastRegion = thisRegion
    }

    return emitter
  }
}

utils.inherits(Game, EventEmitter)

module.exports = Game;
