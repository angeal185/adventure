const player = require('../modules/player'),
fs = require('fs'),
skin = require('../modules/minecraft-skin'),
config = require('../data/config'),
walk = require('../modules/walk');

const utils = {
  dispatch(evt, data){
    window.dispatchEvent(new CustomEvent(evt, {detail: data}))
  },
  walk(target){
    walk.render(target.playerSkin);
    let vx = Math.abs(target.velocity.x),
    vz = Math.abs(target.velocity.z);

    if (vx > 0.001 || vz > 0.001) {
      walk.stopWalking()
    } else {
      walk.startWalking()
    }
  },
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
  blockImg(sel){
    let arr = [],
    opts = config.defaults;
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
  create_npc(obj){

    let createNewPlayer = utils.add_npc(obj.rt),
    newPlayer = createNewPlayer(obj.skin);
    newPlayer.yaw.position.set(...obj.position);
    newPlayer.id = obj.id;
    npc.push(newPlayer);
  },
  add_npc(rt) {
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
       y === -3 && z !== -20 && z !== 40 && x !== -20 && x !== 60 ||
       y === -5 && z !== -20 && z !== 40 && x !== -20 && x !== 60 ||
       y === -6 && z !== -20 && z !== 40 && x !== -20 && x !== 60 ||
       y === -8 && z !== -20 && z !== 40 && x !== -20 && x !== 60 ||
       y === -9 && z !== -20 && z !== 40 && x !== -20 && x !== 60
     ){
      return 0;
    }

    if (y === 0 || y === -1 || y === -4){
      return 8;
    }

    if (y === -7){
      return 6;
    }


    return y === 1 ? 8 : 0 || y < 1 && y > -10 ? 6 : 0 || y === -10 ? 3 : 0
  },
  avatar(game, opts){
    let createPlayer = player(game),
    a = createPlayer(opts.playerSkin);

    a.possess()
    a.yaw.position.set(9, 2, 15)
    return a;
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
  },
  focus(){
    window.game.view.element.requestPointerLock();
  },
  unfocus(){
    document.exitPointerLock();
  },
  dead(contact){
    isDead = true;
    contact.classList.add('show');
    contact.firstChild.textContent = 'Game';
    contact.lastChild.textContent = 'You died!';
    setTimeout(function(){
      location.reload()
    },1000)
  },
  toast(contact, head, body){
    if(user.indisposed){
      return;
    }
    user.indisposed = true;
    contact.classList.add('show')
    contact.firstChild.textContent = head;
    contact.lastChild.textContent = body;
    setTimeout(function(){
      contact.classList.remove('show');
      setTimeout(function(){
        contact.firstChild.textContent = '';
        contact.lastChild.textContent = '';
        user.indisposed = false;
      },1000)
    },3000)

  },
  toHome(){
    avatar.position.set(9, 2, 15);
    utils.dispatch('contact', {
      name: 'location',
      msg: 'Home'
    })
  },
  toPrison(){
    let cnt = lvl.prisonTime;
    avatar.position.set(...utils.rndArr(lvl.prison));
    utils.dispatch('contact', {
      name: 'location',
      msg: 'Prison'
    })
    utils.dispatch('counter', {
      time: cnt,
      show: true,
      title: 'Prison time remaining'
    })
    global.timer = setInterval(function(){
      console.log(utils.toHMS(cnt))
      if(cnt === 0){
        clearInterval(timer);
        utils.fromPrison();
        return;
      }
      utils.dispatch('counter', {
        time: cnt
      })
      cnt--
    }, 1000)
    return;
  },
  fromPrison(){
    utils.dispatch('counter', {
      hide: true
    })
    clearInterval(timer);
    utils.toHome();
  },
  toHMS(sec_num) {

      let hours   = Math.floor(sec_num / 3600),
      minutes = Math.floor((sec_num - (hours * 3600)) / 60),
      seconds = sec_num - (hours * 3600) - (minutes * 60);

      if(hours   < 10) {
        hours   = "0"+hours;
      }
      if(minutes < 10){
        minutes = "0"+minutes;
      }
      if(seconds < 10){
        seconds = "0"+seconds;
      }
      return hours+':'+minutes+':'+seconds;
  },
  counterDisplay(counter,evt){
    if(evt.time){
      counter.textContent = utils.toHMS(evt.time)
    }
    if(evt.title){
      counter.title = evt.title
    }
    if(evt.show){
      counter.classList.add('show');
    }
    if(evt.hide){
      counter.classList.remove('show');
      setTimeout(function(){
        counter.title = '';
        counter.textContent = '';
      },1000)
    }
  },
  keydown(evt, minmap){
    console.log(evt.keyCode)

    if([37,38,39,40,65,68,87,83].indexOf(evt.keyCode !== -1)){

      let pos = utils.getpos(game);

      if(pos[1] < -18){
        if(!isDead){
          utils.dead(contact);
        }
      }
      minmap.textContent = pos.toString();

    }


  },
  keyup(evt, currentBlock){

    if (evt.keyCode === 27){
      utils.unfocus();
    }

    if (evt.keyCode === 82){
      avatar.toggle();
    }

    if (evt.keyCode === 112){

      fs.copyFile('./app/data/map.json', './app/data/map.json.bak', function(err){
        if(err){return console.error('Failed to backup map data')}
        fs.writeFile('./app/data/map.json', JSON.stringify(xframe), function(err){
          if(err){return console.error('Failed to save map data')}
          console.log('Map data saved')
        })
      })

    }

    if (evt.keyCode === 113){
      location.reload()
    }

    if (evt.keyCode === 16){
      let pos = JSON.stringify(utils.getpos(game))
      //console.log(pos)
      let isPortal = false;

      for (let i = 0; i < lvl.characters.length; i++) {
        for (let j = 0; j < lvl.characters[i].action.length; j++) {
          if(pos === JSON.stringify(lvl.characters[i].action[j])){
            let char = lvl.characters[i];
            utils.dispatch('contact', {
              name: char.name,
              msg: char.speech()
            })

            if(char.dialogue){
              utils.dispatch('show-dialogue', {
                head: char.name,
                data: char.dialogue[char.idx]
              })
              utils.unfocus();
            }
            isPortal = true;
            break;
          }
        }
      }

      if(!isPortal){

        for (let i = 0; i < lvl.portals.length; i++) {
          if(JSON.stringify(lvl.portals[i][0]) === pos){
            pos = Array.from(lvl.portals[i][1]);
            pos[1]++
            avatar.position.set(...pos);
            isPortal = true;
            if(lvl.portals[i][2]){
              utils.dispatch('contact', {
                name: 'location',
                msg: lvl.portals[i][2][1]
              })
            }
            break;
          }
          if(JSON.stringify(lvl.portals[i][1]) === pos){
            pos = Array.from(lvl.portals[i][0]);
            pos[1]++
            avatar.position.set(...pos);
            isPortal = true;
            if(lvl.portals[i][2]){
              utils.dispatch('contact', {
                name: 'location',
                msg: lvl.portals[i][2][0]
              })
            }
            break;
          }
        }
      }

      if(!isPortal){
        for (let i = 0; i < lvl.doors.length; i++) {
          if(JSON.stringify(lvl.doors[i][0]) === pos){
            let item = lvl.doors[i][1];
            game.setBlock(item, 0);
            item[1]++;
            game.setBlock(item, 0);
            utils.doorBlock(game, item)
            lvl.doors.splice(i,1)
            break;
          }
        }
      }

    }


    if (evt.keyCode === 73){
      window.dispatchEvent(new Event('show-inventory'));
      utils.unfocus();
    }



    if (evt.keyCode >= 49 && evt.keyCode <= 57){
      user.selectedBlock = parseInt(evt.key)
      let ttl = utils.blockImg(config.defaults ,config.quick_block[user.selectedBlock - 1]);
      currentBlock.title = ttl[0];
      currentBlock.src = ttl[1];
    }

  }
}

module.exports = utils;
