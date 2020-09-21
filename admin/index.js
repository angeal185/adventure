global.js = JSON.stringify;
global.jp = JSON.parse;
cl = console.log;

const utils = require('./modules/utils');

const app = {
  listen(){
    let sel = this;
    window.onload = function(){
      sel.init();
      window.onload = null;
    }
  },
  init(){
    utils.build()
  }
}

app.listen();
