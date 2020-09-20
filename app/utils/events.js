const utils = require('./'),
fly = require('../modules/fly'),
highlight = require('../modules/highlight'),
{snow, stars} = require('../modules/sky'),
config = require('../data/config'),
items = require('../data/items');

//dev
const dev = require('./dev')

function events(label,contact,counter,minmap,currentBlock,compas,clock){

  document.addEventListener('pointerlockchange', function(event){
    if(document.pointerLockElement){
      pointerlock = true;
    } else {
      pointerlock = false;
    }
  })

  let target = game.controls.target();
  game.flyer = fly(game)(target),
  worker = new Worker('worker.js', {
    type: 'module'
  });

  //worker.postMessage([document]);

  let hl = game.highlighter = highlight(game, {
    color: 0xff0000
  }),
  blockPosPlace,
  blockPosErase,
  sel;

  hl.on('highlight', function(voxelPos) {

    dev.addNpc(voxelPos)
    //console.log(voxelPos)
    blockPosErase = voxelPos;
    sel = game.getBlock(voxelPos);
    if(items.keys.indexOf(sel) !== -1){
      game.showlbl = true;
      label.classList.remove('hide');
      label.textContent = items.obj[sel.toString()].title;
    }

  })

  hl.on('remove', function(voxelPos) {
    blockPosErase = null;
    sel = null;

    if(game.showlbl){
      label.classList.add('hide');
      label.textContent = '';
      game.showlbl = false;
    }

  })

  hl.on('highlight-adjacent', function(voxelPos) {
    blockPosPlace = voxelPos
  })

  hl.on('remove-adjacent', function(voxelPos) {
    blockPosPlace = null

  })

  // block interaction stuff, uses highlight data

  game.on('fire', function(target, state, xr) {

    let position = blockPosPlace;

    if (position) {
      let item = user.selectedBlock;

      if(config.defaults.materials[user.selectedBlock - 1] === 'water_overlay'){
        return utils.waterBlock(game, position);
      }

      game.createBlock(position, item)
      if(item === 13){
        dev.addCrete([position, 0])
      }


    } else {
      //console.log(target)

      position = blockPosErase;

      if(sel === 13){
        console.log('crete')
      }

      //return console.log(game.getBlock(blockPosErase))

      if (position && position[1] > -10) {
        game.setBlock(position, 0)

      }

    }
  })


  game.on('tick', function() {
    utils.walk(target);
    snow.tick();
  })

  setInterval(function(){
    stars.tick();
    utils.compas(compas);
    if(user.life !== 100 && user.life !== 0){
      utils.vitalize({item: 'life', ammount: 1, add: true})
    }
    if(user.mana !== 100){
      utils.vitalize({item: 'mana', ammount: 2, add: true})
    }
  },1000)

  window.addEventListener('contact', function (evt) {
    evt = evt.detail;
    utils.toast(contact, evt.name, evt.msg);
  }, false);

  window.addEventListener('clock', function (evt) {
    evt = evt.detail;
    utils.clock(evt, clock);
  }, false);

  window.addEventListener('counter', function (evt) {
    evt = evt.detail;
    utils.counterDisplay(counter,evt);
  }, false);

  window.addEventListener('teleport', function (evt) {
    evt = evt.detail;
    avatar.position.set(...evt.pos);
    utils.dispatch('contact', {
      name: evt.name,
      msg: evt.msg
    })
  }, false);

  window.addEventListener('keydown', function(evt) {
    utils.keydown(evt, minmap);
  })

  window.addEventListener('keyup', function(evt) {
    utils.keyup(evt, currentBlock);
  })

  return utils;
}

module.exports = events;
