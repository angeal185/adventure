const materials = require('./materials'),
sky = require('./sky');

module.exports = {
  sky: sky,
  skySpeed: 10000,
  skyDelay: 10000,
  defaults: {
    playerSkin: './app/img/skin/hero.png',
    playerHeight: 1.62,
    chunkDistance: 2,
    removeDistance: 3,
    meshType: 'surfaceMesh',
    generateChunks: true,
    texturePath: 'app/img/textures/',
    materials: materials,
    materialFlatColor: false,
    worldOrigin: [0, 0, 0],
    startingPosition: [35, 1024, 35],
    skyColor: 0xffffff,
    fogColor: 0xdddddd,
    fogDisabled: false,
    fogScale: 600,
    lightsDisabled: false,
    controls: {
      discreteFire: true,
      speed: 0.0032,
      maxSpeed: 0.0112,
      jumpMaxSpeed: 0.016,
      jumpTimer: 200,
      jumpSpeed: 0.004,
      fireRate: 0,
      rotationXMax: 33,
      rotationYMax: 33,
      rotationZMax: 33,
      rotationXClamp: Math.PI / 2,
      rotationYClamp: Infinity,
      rotationZClamp: 0,
      accelTimer: 200
    },
    fov: 60,
    nearPlane: 1,
    farPlane: 10000,
    statsDisabled: true,
    keybindings: {
      'W': 'forward',
      'A': 'left',
      'S': 'backward',
      'D': 'right',
      '<up>': 'forward',
      '<left>': 'left',
      '<down>': 'backward',
      '<right>': 'right',
      '<mouse 1>': 'fire',
      '<space>': 'jump',
      '<shift>': 'crouch',
      '<control>': 'alt'
    }
  },
  quick_block: [1,2,3,4,5,6,7,8,9,10,11,12],
  arrayType: Uint8Array,
  snow: {
    count: 1000,
    size: 20,
    speed: 0.1,
    drift: 1
  },
  stars: {
    count: 1000,
    size: 20,
    speed: 0.1,
    drift: 1,
  }
}
