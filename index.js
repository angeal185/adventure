require('./pre')

const
createGame = require('./app/modules/engine'),
highlight = require('./app/modules/highlight'),
fly = require('./app/modules/fly'),
registry = require('./app/modules/registry'),
x = require('./app/utils/xscript'),
tpl = require('./app/views/tpl'),
map = require('./app/data/map'),
config = require('./app/data/config'),
utils = require('./app/utils');

global.lvl = localStorage.getItem('lvl') || 0;
global.lvl = require('./app/data/lvl_'+ lvl);

let opts = Object.assign(config.defaults, {
  generate: utils.generate
});


global.game = createGame(opts);
global.xframe = map;
window.npc = [];

const {snow, stars} = require('./app/modules/sky');

let minmap = x('div', {id: 'minmap'}),
contact = x('div', {id: 'contact'},
  x('div'),x('div')
),
counter = x('div', {id: 'counter'})


let blockarr = utils.blockImg(),
currentBlock = x('img', {
  title: blockarr[0],
  src: blockarr[1]
})

window.addEventListener('contact', function (evt) {
  evt = evt.detail;
  utils.toast(contact, evt.name, evt.msg)
}, false);

window.addEventListener('counter', function (evt) {
  evt = evt.detail;
  utils.counterDisplay(counter,evt)
}, false);

function defaultSetup(game, avatar) {

  let target = game.controls.target();
  game.flyer = fly(game)(target);

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


  window.addEventListener('keydown', function(evt) {
    utils.keydown(evt, minmap)
  })

  window.addEventListener('keyup', function(evt) {
    utils.keyup(evt, currentBlock)
  })

  // block interaction stuff, uses highlight data

  game.on('fire', function(target, state, xr) {

    var position = blockPosPlace;

    if (position) {
      if(opts.materials[user.selectedBlock - 1] === 'water_overlay'){
        return utils.waterBlock(game, position);
      }
      xframe[user.selectedBlock].push(position)
      game.createBlock(position, user.selectedBlock)


    } else {
      //console.log(target)

      position = blockPosErase
      console.log(game.getBlock(blockPosErase))
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
    utils.walk(target);
    snow.tick();
    stars.tick();
  })

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      game.setBlock(map[i][j], i)
    }
  }

  utils.initSky(config.sky, config.skySpeed, config.skyDelay);

  setTimeout(function(){
    document.body.classList.add('show');
    setTimeout(function(){
      utils.dispatch('contact', {
        name: 'location',
        msg: 'Home'
      })
    },1000)
  },3000)


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
        let blk = utils.blockImg(config.quick_block[i]);
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
    counter,
    tpl.dialogue(),
    tpl.inventory()
  )
)

game.appendTo(container);

for (let i = 0; i < lvl.characters.length; i++) {
  utils.create_npc(lvl.characters[i])
}

global.avatar = utils.avatar(game, opts)

defaultSetup(game, avatar);

utils.focus();
