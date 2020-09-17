const utils = require('./'),
fly = require('../modules/fly'),
highlight = require('../modules/highlight'),
{snow, stars} = require('../modules/sky');

function events(contact,counter,minmap,currentBlock,compas){

  document.addEventListener('pointerlockchange', function(event){
    if(document.pointerLockElement){
      pointerlock = true;
    } else {
      pointerlock = false;
    }
  })

  let target = game.controls.target();
  game.flyer = fly(game)(target);

  let hl = game.highlighter = highlight(game, {
    color: 0xff0000
  }),
  blockPosPlace,
  blockPosErase;

  hl.on('highlight', function(voxelPos) {
    //console.log(voxelPos)
    dev.addNpc(voxelPos)
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
  })

  setInterval(function(){
    stars.tick();
    utils.compas(compas);
    if(user.life !== 100){
      user.life++
      let percent = user.life + '%'
      ele.life.lastChild.style.width = percent;
      ele.life.title = percent;
    }
    if(user.mana !== 100){
      user.mana++
      let percent = user.mana + '%'
      ele.mana.lastChild.style.width = percent;
      ele.mana.title = percent;
    }
  },1000)

  window.addEventListener('contact', function (evt) {
    evt = evt.detail;
    utils.toast(contact, evt.name, evt.msg)
  }, false);

  window.addEventListener('counter', function (evt) {
    evt = evt.detail;
    utils.counterDisplay(counter,evt)
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
    utils.keydown(evt, minmap)
  })

  window.addEventListener('keyup', function(evt) {
    utils.keyup(evt, currentBlock)
  })
  return utils;
}

module.exports = events;
