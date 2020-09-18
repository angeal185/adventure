const events = require('events'),
utils = require('../utils');

function Chunker(opts) {
  this.distance = opts.chunkDistance;
  this.chunkSize = opts.chunkSize;
  this.cubeSize = opts.cubeSize;
  this.generateVoxelChunk = opts.generateVoxelChunk
  this.chunks = {}
  this.meshes = {}

  if (this.chunkSize & this.chunkSize-1 !== 0){
    throw new Error('chunkSize must be a power of 2')
  }
  let bits = 0, size;
  for (size = this.chunkSize; size > 0; size >>= 1){
    bits++;
  }
  this.chunkBits = bits - 1;
}

Chunker.prototype = {
  nearbyChunks(position, distance) {
    let current = this.chunkAtPosition(position),
    x = current[0],
    y = current[1],
    z = current[2],
    dist = distance || this.distance,
    nearby = [], cx;

    for (cx = (x - dist); cx !== (x + dist); ++cx) {
      for (var cy = (y - dist); cy !== (y + dist); ++cy) {
        for (var cz = (z - dist); cz !== (z + dist); ++cz) {
          nearby.push([cx, cy, cz])
        }
      }
    }
    return nearby
  },
  requestMissingChunks(position) {
    let self = this;
    this.nearbyChunks(position).map(function(chunk) {
      if (!self.chunks[chunk.join('|')]) {
        self.emit('missingChunk', chunk)
      }
    })
  },
  getBounds(x, y, z) {
    let bits = this.chunkBits,
    low = [x << bits, y << bits, z << bits],
    high = [(x+1) << bits, (y+1) << bits, (z+1) << bits];

    return [low, high]
  },
  generateChunk(x, y, z) {
    let self = this,
    bounds = this.getBounds(x, y, z),
    chunk = this.generateVoxelChunk(bounds[0], bounds[1], x, y, z),
    position = [x, y, z];

    chunk.position = position;
    this.chunks[position.join('|')] = chunk;
    return chunk
  },
  chunkAtCoordinates(x, y, z) {
    let bits = this.chunkBits,
    cx = x >> bits,
    cy = y >> bits,
    cz = z >> bits;
    return [cx, cy, cz];
  },
  chunkAtPosition(position) {
    let cubeSize = this.cubeSize,
    x = Math.floor(position[0] / cubeSize),
    y = Math.floor(position[1] / cubeSize),
    z = Math.floor(position[2] / cubeSize);
    return this.chunkAtCoordinates(x, y, z)
  },
  voxelIndexFromCoordinates(x, y, z) {
    let bits = this.chunkBits,
    mask = (1 << bits) - 1;
    return (x & mask) + ((y & mask) << bits) + ((z & mask) << bits * 2)
  },
  voxelIndexFromPosition(pos) {
    let v = this.voxelVector(pos);
    return this.voxelIndex(v);
  },
  voxelAtCoordinates(x, y, z, val) {
    let ckey = this.chunkAtCoordinates(x, y, z).join('|'),
    chunk = this.chunks[ckey];

    if(!chunk){
      return false;
    }

    let vidx = this.voxelIndexFromCoordinates(x, y, z),
    v = chunk.voxels[vidx];

    if (typeof val !== 'undefined') {
      chunk.voxels[vidx] = val
    }
    return v;
  },
  voxelAtPosition(pos, val) {
    let cubeSize = this.cubeSize,
    x = Math.floor(pos[0] / cubeSize),
    y = Math.floor(pos[1] / cubeSize),
    z = Math.floor(pos[2] / cubeSize);
    return this.voxelAtCoordinates(x, y, z, val);
  },
  // deprecated
  voxelIndex(voxelVector) {
    return this.voxelIndexFromCoordinates(voxelVector[0], voxelVector[1], voxelVector[2])
  },
  // deprecated
  voxelVector(pos) {
    let cubeSize = this.cubeSize,
    mask = (1 << this.chunkBits) - 1,
    vx = (Math.floor(pos[0] / cubeSize)) & mask,
    vy = (Math.floor(pos[1] / cubeSize)) & mask,
    vz = (Math.floor(pos[2] / cubeSize)) & mask;
    return [vx, vy, vz]
  }
}

utils.inherits(Chunker, events.EventEmitter)

module.exports = function(opts) {
  return new Chunker(opts)
}

module.exports.Chunker = Chunker
