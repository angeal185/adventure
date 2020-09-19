require('./pre');

const config = require('./app/data/config'),
tpl = require('./app/views/tpl'),
utils = require('./app/utils'),
events = require('./app/utils/events');

//dev
const map = require('./app/data/map'),
dev = require('./app/utils/dev');


global.xframe = map;

const app = {
  listen(){
    let sel = this;
    window.onload = function(){
      sel.init();
      window.onload = null;
    }
  },
  init(){

    let minmap = tpl.minmap(),
    compas = tpl.compas(),
    contact = tpl.contact(),
    counter = tpl.counter(),
    crosshair = tpl.crosshair(),
    label = tpl.label(),
    blockarr = utils.blockImg(),
    currentBlock = tpl.currentBlock(blockarr),
    clock = tpl.clock();

    utils.buildBody(utils,currentBlock,crosshair,label,minmap,contact,counter,compas,clock).addCharacters().buildMap()

    events(label,contact,counter,minmap,currentBlock,compas,clock).display()

  }
}

app.listen()
