const low = require('lowdb'),
FileSync = require('lowdb/adapters/FileSync'),
adapter = new FileSync('./app/data/db.json'),
lvls = require('./app/data/lvls');

process.browser = true;

global.lvl = localStorage.getItem('lvl') || 0;
global.pointerlock = false;
global.mapStats = {
  pos: [-1,-1], // current position
  mark:[-1,0], // dynamic marker
  mission:[-1,0], // dynamic marker
  dest: [-1, 0], // dynamic marker
  cnv: document.createElement('canvas'),
  offset: lvls[lvl].mapOffset,
  sz: lvls[lvl].mapSize
}

global.ele = {};
global.lvl = require('./app/data/lvl_'+ lvl);

global.npc = [];
global.db = low(adapter);
global.user = {
  selectedBlock: 1,
  life: 50,
  mana: 50,
  states: {
    shadow: false,
    levitate: false,
    isDead: false
  }
}
global.isDead = false;

const config = require('./app/data/config'),
createGame = require('./app/modules/engine');

global.game = createGame(config.defaults);

db.defaults({
  game:{
    lvl: 0,
    name: ''
  },
  user: {
    lvl: 0,
    exp: 0,
    alignment: 50,
    reputation: 0,
    gold: 0,
    inventory: [],
    portal:[],
    stones:[],
    skills:{
      
    }
  },
  created: Date.now()
}).write()
