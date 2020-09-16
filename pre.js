const low = require('lowdb'),
FileSync = require('lowdb/adapters/FileSync'),
adapter = new FileSync('./app/data/db.json');

global.db = low(adapter)
process.browser = true;
global.user = {
  selectedBlock: 1
}
global.isDead = false;

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
    stones:[]
  },
  created: Date.now()
}).write()
