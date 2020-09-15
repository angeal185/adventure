require('./pre')

const fs = require('fs'),
createGame = require('./app/modules/engine'),
highlight = require('./app/modules/highlight'),
fly = require('./app/modules/fly'),
walk = require('./app/modules/walk'),
registry = require('./app/modules/registry'),
x = require('./app/utils/xscript'),
tpl = require('./app/views/tpl'),
map = require('./app/data/map'),
config = require('./app/data/config'),
utils = require('./app/utils'),
lvl0_npc = require('./app/data/lvl_0/npc');

let opts = Object.assign(config.defaults, {
  generate: utils.generate
});

global.game = createGame(opts);

const {snow, stars} = require('./app/modules/sky');


window.xframe = map;

let minmap = x('div', {id: 'minmap'}),
contact = x('div', {id: 'contact'},
  x('div'),x('div')
)





let blockarr = utils.blockImg(opts),
currentBlock = x('img', {
  title: blockarr[0],
  src: blockarr[1]
})

window.addEventListener('contact', function (evt) {
  if(user.indisposed){
    return;
  }
  user.indisposed = true;
  evt = evt.detail;
  contact.classList.add('show')
  contact.firstChild.textContent = evt.name;
  contact.lastChild.textContent = evt.msg;
  setTimeout(function(){
    contact.classList.remove('show');
    user.indisposed = false;
  },3000)
}, false);

function defaultSetup(game, avatar) {

  let makeFly = fly(game),
  target = game.controls.target();
  game.flyer = makeFly(target);

  // highlight blocks when you look at them, hold <Ctrl> for block placement
  let hl = game.highlighter = highlight(game, {
    color: 0xff0000
  }),
  blockPosPlace,
  blockPosErase;

  hl.on('highlight', function(voxelPos) {
    console.log(voxelPos)
    blockPosErase = voxelPos
  })

  hl.on('remove', function(voxelPos) {
    blockPosErase = null;

  })

  hl.on('highlight-adjacent', function(voxelPos) {
    blockPosPlace = voxelPos
  })

  hl.on('remove-adjacent', function(voxelPos) {
    blockPosPlace = null

  })


  // toggle between first and third person modes
  window.addEventListener('keydown', function(evt) {

    console.log(evt.keyCode)

    if (evt.keyCode === 27){
      document.exitPointerLock();
    }

    if([37,38,39,40,65,68,87,83].indexOf(evt.keyCode !== -1)){

      let pos = utils.getpos(game);

      if(pos[1] < -18){
        console.log('dead')
        pos[1] = 100;
        location.reload()
      }
      minmap.textContent = pos.toString();

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

      for (let i = 0; i < lvl0_npc.characters.length; i++) {
        for (let j = 0; j < lvl0_npc.characters[i].action.length; j++) {
          if(pos === JSON.stringify(lvl0_npc.characters[i].action[j])){
            let char = lvl0_npc.characters[i];
            window.dispatchEvent(new CustomEvent('contact', {
              detail: {
                name: char.name,
                msg: char.speech()
              }
            }))
            if(char.dialogue){
              window.dispatchEvent(new CustomEvent('show-dialogue', {
                detail: {
                  head: char.name,
                  data: char.dialogue[char.idx]
                }
              }))
              document.exitPointerLock();
            }
            isPortal = true;
            break;
          }
        }
      }

      if(!isPortal){

        for (let i = 0; i < lvl0_npc.portals.length; i++) {
          if(JSON.stringify(lvl0_npc.portals[i][0]) === pos){
            pos = Array.from(lvl0_npc.portals[i][1]);
            pos[1]++
            avatar.position.set(...pos);
            isPortal = true;
            break;
          }
          if(JSON.stringify(lvl0_npc.portals[i][1]) === pos){
            pos = Array.from(lvl0_npc.portals[i][0]);
            pos[1]++
            avatar.position.set(...pos);
            isPortal = true;
            break;
          }
        }
      }

      if(!isPortal){
        for (let i = 0; i < lvl0_npc.doors.length; i++) {
          if(JSON.stringify(lvl0_npc.doors[i][0]) === pos){
            let item = lvl0_npc.doors[i][1];
            game.setBlock(item, 0);
            item[1]++;
            game.setBlock(item, 0);
            utils.doorBlock(game, item)
            lvl0_npc.doors.splice(i,1)
            break;
          }
        }
      }

    }


    if (evt.keyCode === 73){
      window.dispatchEvent(new Event('show-inventory'));
      document.exitPointerLock();
    }



    if (evt.keyCode >= 49 && evt.keyCode <= 57){
      user.selectedBlock = parseInt(evt.key)
      let ttl = utils.blockImg(opts,config.quick_block[user.selectedBlock - 1]);
      currentBlock.title = ttl[0];
      currentBlock.src = ttl[1];
    }
  })

  // block interaction stuff, uses highlight data

  game.on('fire', function(target, state, xr) {

    var position = blockPosPlace
    if (position) {
      if(opts.materials[user.selectedBlock - 1] === 'water_overlay'){
        return utils.waterBlock(game, position);
      }
      xframe[user.selectedBlock].push(position)
      game.createBlock(position, user.selectedBlock)


    } else {
      console.log(target)

      position = blockPosErase

      if (position && position[1] > -10) {
        game.setBlock(position, 0)

        for (let i = 0; i < xframe.length; i++) {
          for (let j = 0; j < xframe[i].length; j++) {
            if(JSON.stringify(xframe[i][j]) === JSON.stringify(position)){
              xframe[i].splice(j,1);
            }
          }
        }

      }
    }
  })


  game.on('tick', function() {

    walk.render(target.playerSkin)
    var vx = Math.abs(target.velocity.x)
    var vz = Math.abs(target.velocity.z)
    if (vx > 0.001 || vz > 0.001) {
      walk.stopWalking()
    } else {
      walk.startWalking()
    }
    snow.tick();
    stars.tick();
  })

}

var container = x('app-main',
  x('div', {id: 'crosshair'},
    x('img', {src: './app/img/crosshair.png'})
  )
)

document.body.append(
  x('app-menu', {id: 'app-menu'},
    currentBlock,
    function(){
      let div = x('div', {class: 'quick-block'});
      for (let i = 0; i < config.quick_block.length; i++) {
        let blk = utils.blockImg(opts,config.quick_block[i]);
        div.append(x('img', {
          title: blk[0],
          src: blk[1],
          onclick(evt){
            user.selectedBlock = config.quick_block[i];
            currentBlock.src = evt.target.src;
            currentBlock.title = evt.target.title;
          }
        }))
      }
      return div;
    }
  ),
  container,
  x('app-sub',
    minmap,
    contact,
    tpl.dialogue(),
    tpl.inventory()
  )
)

game.appendTo(container);

for (let i = 0; i < lvl0_npc.characters.length; i++) {
  utils.create_npc(game, lvl0_npc.characters[i])
}

let avatar = utils.avatar(game, opts)

defaultSetup(game, avatar);


for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    game.setBlock(map[i][j], i)
  }
}



//utils.addItem(game)



utils.initSky(config.sky, config.skySpeed, config.skyDelay)
