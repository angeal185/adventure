require('./pre');

const config = require('./app/data/config'),
tpl = require('./app/views/tpl'),
map = require('./app/data/map'),
utils = require('./app/utils'),
events = require('./app/utils/events'),
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
    contact = tpl.contact(),
    counter = tpl.counter(),
    container = tpl.container(),
    blockarr = utils.blockImg(),
    currentBlock = tpl.currentBlock(blockarr);

    utils.buildBody(currentBlock,container,minmap,contact,counter).addCharacters().buildMap()

    events(contact,counter,minmap,currentBlock).display()

  }
}

app.listen()
