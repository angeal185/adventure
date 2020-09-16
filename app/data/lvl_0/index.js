const utils = require('../../utils'),
dialogue = require('../dialogue');

module.exports = {
  characters: [{
    id: 1,
    idx: 0,
    name: 'villager',
    skin: './app/img/skin/villager_01.png',
    speech(){
      return utils.rndArr(dialogue.greetings);
    },
    dialogue: [{
      body: 'id:1'
    }],
    position: [3, 2, 9],
    action: [[3,1,8], [2,1,8], [3,1,9],[2,1,9]],
    rt: null
  },{
    id: 2,
    idx: 0,
    name: 'villager',
    skin: './app/img/skin/villager_02.png',
    speech(){
      return utils.rndArr(dialogue.greetings);
    },
    dialogue: [{
      body: 'id:2'
    }],
    position: [15, 2, 8],
    action: [[14,1,8], [15,1,8], [14,1,7],[15,1,7]],
    rt: -90
  },{
    id: 3,
    idx: 0,
    name: 'villager',
    skin: './app/img/skin/villager_01.png',
    speech(){
      return utils.rndArr(dialogue.greetings);
    },
    dialogue: [{
      body: 'id:3'
    }],
    position: [22, 2, 8],
    action: [[21,1,8], [22,1,8], [21,1,7],[22,1,7]],
    rt: 90
  },{
    id: 4,
    idx: 0,
    name: 'villager',
    skin: './app/img/skin/villager_01.png',
    speech(){
      return utils.rndArr(dialogue.greetings);
    },
    dialogue: [{
      body: 'id:4'
    }],
    position: [30, 2, 8],
    action: [[30,1,8], [29,1,8], [30,1,7],[29,1,7]],
    rt: 90
  },{
    id: 5,
    idx: 0,
    name: 'villager',
    skin: './app/img/skin/villager_01.png',
    speech(){
      return utils.rndArr(dialogue.greetings);
    },
    dialogue: [{
      body: 'id:5'
    }],
    position: [29, 2, -1],
    action: [[29,1,-1], [29,1,-2], [28,1,-1],[28,1,-2]],
    rt: 180
  },{
    id: 6,
    idx: 0,
    name: 'villager',
    skin: './app/img/skin/villager_01.png',
    speech(){
      return utils.rndArr(dialogue.greetings);
    },
    dialogue: [{
      body: 'id:6'
    }],
    position: [25, 2, -1],
    action: [[25, 1, -1], [25, 1, -2], [24, 1, -1],[24,1,-2]],
    rt: 180
  }],
  portals: [
    [[58,1,-18],[58,-4,-18], ['slums', 'ghetto']]
  ],
  doors: [
    [[10,1,12],[11,2,12], null],
    [[9,1,5],[9,2,6], null],
    [[3,1,5],[3,2,6], null],
    [[19,1,5],[19,2,6], null],
    [[28,1,5],[28,2,6], null],
    [[27,1,4],[27,2,3], null],
    [[16,1,4],[16,2,3], null],
    [[5,1,4],[5,2,3], null],
    [[-6,1,4],[-6,2,3], null],
    [[-7,1,19],[-7,2,20], null],
    [[3,1,19],[3,2,20], null],
    [[14,1,19],[14,2,20], null],
    [[21,1,19],[21,2,20], null],
    [[28,1,19],[28,2,20], null],
    [[36,1,19],[36,2,20], null],
    [[47,1,18],[47,2,17], null],
    [[37,1,18],[37,2,17], null],
    [[29,1,18],[29,2,17], null],
    [[22,1,18],[22,2,17], null],
    [[16,1,18],[16,2,17], null],
    [[-6,1,18],[-6,2,17], null],
    [[-13,1,31],[-14,2,31], null],
    [[-13,1,16],[-14,2,16], null],
    [[-13,1,12],[-14,2,12], null],
    [[-13,1,7],[-14,2,7], null],
    [[-13,1,2],[-14,2,2], null],
    [[-13,1,-5],[-14,2,-5], null],
    [[-12,1,-13],[-12,2,-14], null],
    [[1,1,-13],[1,2,-14], null],
    [[15,1,-13],[15,2,-14], null],
    [[28,1,-13],[28,2,-14], null],
    [[37,1,-13],[37,2,-14], null],
    [[45,1,-13],[45,2,-14], null],
    [[51,1,-13],[51,2,-14], null],
    [[-11,1,34],[-11,2,35], null],
    [[-5,1,34],[-5,2,35], null],
    [[4,1,34],[4,2,35], null],
    [[13,1,34],[13,2,35], null],
    [[23,1,34],[23,2,35], null],
    [[33,1,34],[33,2,35], null],
    [[43,1,34],[43,2,35], null],
    [[51,1,34],[51,2,35], null],
    [[53,1,33],[54,2,33], null],
    [[53,1,28],[54,2,28], null],
    [[53,1,21],[54,2,21], null],
    [[53,1,12],[54,2,12], null],
    [[53,1,3],[54,2,3], null],
    [[53,1,-4],[54,2,-4], null],
    [[53,1,-10],[54,2,-10], null],
    [[37,1,-12],[37,2,-11], null],
    [[27,1,-12],[27,2,-11], null],
    [[16,1,-12],[16,2,-11], null],
    [[4,1,-12],[4,2,-11], null],
    [[3,1,33],[3,2,32], null],
    [[12,1,33],[12,2,32], null],
    [[21,1,33],[21,2,32], null],
    [[28,1,33],[28,2,32], null],
    [[36,1,33],[36,2,32], null],
    [[33,1,5],[34,2,5], null],
  ],
  prison: [[18,-9,16],[19,-9,-10],[-7,-9,8],[17,-9,21],[16,-9,27]],
  prisonTime: 300
}
