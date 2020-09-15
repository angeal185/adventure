const player = require('../modules/player'),
npc = require('./npc');

const utils = {
  throttle(fn, delay){
    let inThrottle = false;

    return args => {
      if (inThrottle) {
        return;
      }

      inThrottle = true;
      fn(args);
      setTimeout(function(){
        inThrottle = false;
      }, delay);
    };
  },
  blockImg(opts,sel){
    let arr = []
    if(typeof sel === 'undefined'){
      sel = opts.materials[user.selectedBlock - 1];
    } else {
      sel = opts.materials[sel - 1];
    }
    if(Array.isArray(sel)){
      sel = sel[2];
    }
    arr.push(sel.replace(/_/g, ' '))
    sel = './' + opts.texturePath + sel + '.png';
    arr.push(sel)
    return arr;
  },
  waterBlock(game, dest){
    var mesh = new game.THREE.Mesh(
      new game.THREE.CubeGeometry(1, 4, 1), // width, height, depth
      game.materials.material
    )

    // paint the mesh with a specific texture in the atlas
    game.materials.paint(mesh, 'water_overlay')

    // move the item to some location

      dest[0] = dest[0] + 0.5
      dest[2] = dest[2] + 0.5

    mesh.position.set(...dest)

    game.addItem({
      mesh: mesh,
      size: 1,
      velocity: { x: 0, y: 0, z: 0 } // initial velocity
    })

  },
  doorBlock(game, dest){
    var mesh = new game.THREE.Mesh(
      new game.THREE.CubeGeometry(1, 4, 1), // width, height, depth
      game.materials.material
    )

    // paint the mesh with a specific texture in the atlas
    game.materials.paint(mesh, 'water_overlay')

    // move the item to some location

      dest[0] = dest[0] + 0.5
      dest[2] = dest[2] + 0.5

    mesh.position.set(...dest)

    game.addItem({
      mesh: mesh,
      size: 1,
      velocity: { x: 0, y: 0, z: 0 } // initial velocity
    })

  },
  addItem(game){

    var mesh = new game.THREE.Mesh(
      new game.THREE.CubeGeometry(1, 1, 1), // width, height, depth
      game.materials.material
    )

    // paint the mesh with a specific texture in the atlas
    game.materials.paint(mesh, 'obsidian')

    // move the item to some location
    mesh.position.set(0.5, 1, -5.5)
    game.makePhysical(mesh);

    var item = game.addItem({
      mesh: mesh,
      size: 1,
      velocity: { x: 0, y: 0, z: 0 } // initial velocity
    })
  },
  create_npc(game, obj){
    var createNewPlayer = npc(game, obj.rt);
    var newPlayer = createNewPlayer(obj.skin);
    console.log(newPlayer)

    newPlayer.yaw.position.set(...obj.position)
  },
  getpos(game){
    let pos = game.controls.target().avatar.position.toArray();
    for (let i = 0; i < pos.length; i++) {
      pos[i] = Math.floor(pos[i]);
    }
    pos[1]--
    return pos;
  },
  rndArr(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  },
  generate(x,y,z) {
    if (z < -20 || z > 40 || x < -20 || x > 60) {
      return 0;
    }

    if (y === -2 && z !== -20 && z !== 40 && x !== -20 && x !== 60 ||
       y === -3 && z !== -20 && z !== 40 && x !== -20 && x !== 60
     ){
      return 0;
    }

    if (y === 0 || y === -1 || y === -4){
      return 8;
    }


    return y === 1 ? 8 : 0 || y < 1 && y > -10 ? 1 : 0 || y === -10 ? 3 : 0
  },
  avatar(game, opts){
    let createPlayer = player(game),
    avatar = createPlayer(opts.playerSkin);

    avatar.possess()
    avatar.yaw.position.set(9, 2, 15)
    return avatar;
  },
  initSky(arr, skySpeed, skyDelay){
    setTimeout(function(){
      let len = arr.length,
      cnt = 0,
      light = arr[0][1],
      fog = arr[0][2]
      setInterval(function(){
        skyChange(arr[cnt][0])
        if(arr[cnt][1] !== light){
          light = arr[cnt][1];
          lightChange(light)
        }
        if(arr[cnt][2] !== fog){
          fog = arr[cnt][2];
          fogChange(fog)
        }
        cnt++;
        if(cnt === len){
          cnt = 0;
        }
      },skySpeed)
    },skyDelay)
  }
}

module.exports = utils;
