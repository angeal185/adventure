const player = require('../modules/player');

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
    console.log(obj)
    let createNewPlayer = utils.add_npc(game, obj.rt),
    newPlayer = createNewPlayer(obj.skin);
    newPlayer.yaw.position.set(...obj.position);
    npc.push(newPlayer)
  },
  add_npc(game, rt) {
      var mountPoint;

      return function (img, skinOpts) {
          if (!skinOpts) {
            skinOpts = {};
          }
          skinOpts.scale = skinOpts.scale || new game.THREE.Vector3(0.04, 0.04, 0.04);
          var playerSkin = skin(game.THREE, img, skinOpts);
          var player = playerSkin.mesh;
          var physics = game.makePhysical(player);
          physics.playerSkin = playerSkin;

          if(rt){
            player.rotation.y = game.THREE.Math.degToRad(rt);
          }

          //player.position.set(0, 562, -20);
          game.scene.add(player);
          game.addItem(physics);

          physics.yaw = player;
          physics.pitch = player.head;
          physics.subjectTo(game.gravity);
          physics.blocksCreation = true;

          game.control(physics);

          physics.move = function (x, y, z) {
              var xyz = utils.parseXYZ(x, y, z);
              physics.yaw.position.x += xyz.x;
              physics.yaw.position.y += xyz.y;
              physics.yaw.position.z += xyz.z;
          };

          physics.moveTo = function (x, y, z) {
              var xyz = utils.parseXYZ(x, y, z);
              physics.yaw.position.x = xyz.x;
              physics.yaw.position.y = xyz.y;
              physics.yaw.position.z = xyz.z;
          };


          physics.position = physics.yaw.position;
          return physics;

      }
  },
  parseXYZ(x, y, z){
      if (typeof x === 'object' && Array.isArray(x)) {
          return { x: x[0], y: x[1], z: x[2] };
      } else if (typeof x === 'object') {
        return { x: x.x || 0, y: x.y || 0, z: x.z || 0 };
      }
      return { x: Number(x), y: Number(y), z: Number(z) };
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
