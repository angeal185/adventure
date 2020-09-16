const utils = require('../../utils'),
dialogue = require('../dialogue'),
characters = [{
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
},{
  id: 7,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:7'
  }],
  position: [14, 2, -1],
  action: [[14, 1, -1], [14, 1, -2], [13, 1, -1],[13,1,-2]],
  rt: -90
},{
  id: 8,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:8'
  }],
  position: [18, 2, -1],
  action: [[18, 1, -1], [18, 1, -2], [17, 1, -1],[17,1,-2]],
  rt: 90
},{
  id: 9,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:9'
  }],
  position: [9, 2, 9],
  action: [[9, 1, 8], [9, 1, 9], [8, 1, 8],[8,1,9]],
  rt: null
},{
  id: 10,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:10'
  }],
  position: [9, 2, 12],
  action: [[9,1,12],[9,1,11],[8,1,12],[8,1,11]],
  rt: 180
},{
  id: 11,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:11'
  }],
  position: [-9,2,-8],
  action: [[-9,1,-8],[-9,1,-9],[-10,1,-8],[-10,1,-9]],
  rt: 180
},{
  id: 12,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:12'
  }],
  position: [-4,2,-9],
  action: [[-4,1,-9],[-4,1,-10],[-5,1,-9],[-5,1,-10]],
  rt: 180
},{
  id: 13,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:13'
  }],
  position: [-9,2,0],
  action: [[-9,1,0],[-9,1,-1],[-10,1,0],[-10,1,-1]],
  rt: -90
},{
  id: 14,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:14'
  }],
  position: [3,2,-1],
  action: [[3,1,-1],[3,1,-2],[2,1,-1],[2,1,-2]],
  rt: 180
},{
  id: 15,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:15'
  }],
  position: [6,2,0],
  action: [[6,1,0],[6,1,-1],[5,1,0],[5,1,-1]],
  rt: 180
},{
  id: 16,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:16'
  }],
  position: [-6,2,-4],
  action: [[-6,1,-4],[-6,1,-5],[-7,1,-4],[-7,1,-5]],
  rt: 180
},{
  id: 17,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:17'
  }],
  position: [-18,2,-11],
  action: [[-18,1,-11],[-18,1,-12],[-19,1,-11],[-19,1,-12]],
  rt: 180
},{
  id: 18,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:18'
  }],
  position: [-16,2,-8],
  action: [[-16,1,-8],[-16,1,-9],[-17,1,-8],[-17,1,-9]],
  rt: 180
},{
  id: 19,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:19'
  }],
  position: [-18,2,-3],
  action: [[-18,1,-3],[-18,1,-4],[-19,1,-3],[-19,1,-4]],
  rt: -90
},{
  id: 20,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:20'
  }],
  position: [-18,2,3],
  action: [[-18,1,3],[-18,1,2],[-19,1,3],[-19,1,2]],
  rt: -90
},{
  id: 21,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:21'
  }],
  position: [-16,1,1],
  action: [[-16,1,1],[-16,1,0],[-17,1,1],[-17,1,0]],
  rt: -90
},{
  id: 22,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:22'
  }],
  position: [-17,2,8],
  action: [[-17,1,8],[-17,1,7],[-18,1,8],[-18,1,7]],
  rt: -90
},{
  id: 23,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:23'
  }],
  position: [-18,2,12],
  action: [[-18,1,12],[-18,1,11],[-19,1,12],[-19,1,11]],
  rt: -90
},{
  id: 24,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:24'
  }],
  position: [-18,2,16],
  action: [[-18,1,16],[-18,1,15],[-19,1,16],[-19,1,15]],
  rt: -90
},{
  id: 25,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:25'
  }],
  position: [-17,2,20],
  action: [[-17,1,20],[-17,1,19],[-18,1,20],[-18,1,19]],
  rt: null
},{
  id: 26,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:26'
  }],
  position: [-18,2,31],
  action: [[-18,1,31],[-18,1,30],[-19,1,31],[-19,1,30]],
  rt: -90
},{
  id: 27,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:27'
  }],
  position: [-16,2,25],
  action: [[-16,1,25],[-16,1,24],[-17,1,25],[-17,1,24]],
  rt: 180
},{
  id: 28,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:28'
  }],
  position: [-18,2,28],
  action: [[-18,1,28],[-18,1,27],[-19,1,28],[-19,1,27]],
  rt: 180
},{
  id: 29,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:29'
  }],
  position: [-17,2,37],
  action: [[-17,1,37],[-17,1,36],[-18,1,37],[-18,1,36]],
  rt: -90
},{
  id: 30,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:30'
  }],
  position: [-11,2,38],
  action: [[-11,1,38],[-11,1,37],[-12,1,38],[-12,1,37]],
  rt: null
},{
  id: 31,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:31'
  }],
  position: [-5,2,38],
  action: [[-5,1,38],[-5,1,37],[-6,1,38],[-6,1,37]],
  rt: null
},{
  id: 32,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:32'
  }],
  position: [-2,2,37],
  action: [[-2,1,37],[-2,1,36],[-3,1,37],[-3,1,36]],
  rt: 90
},{
  id: 33,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:33'
  }],
  position: [2,2,38],
  action: [[2,1,38],[2,1,37],[1,1,38],[1,1,37]],
  rt: null
},{
  id: 34,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:34'
  }],
  position: [6,2,38],
  action: [[6,1,38],[6,1,37],[5,1,38],[5,1,37]],
  rt: null
},{
  id: 35,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:35'
  }],
  position: [14,2,38],
  action: [[14,1,38],[14,1,37],[13,1,38],[13,1,37]],
  rt: null
},{
  id: 36,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:36'
  }],
  position: [10,2,37],
  action: [[10,1,37],[10,1,36],[9,1,37],[9,1,36]],
  rt: -90
},{
  id: 37,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:37'
  }],
  position: [22,2,38],
  action: [[22,1,38],[22,1,37],[21,1,38],[21,1,37]],
  rt: null
},{
  id: 38,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:38'
  }],
  position: [19,2,37],
  action: [[19,1,37],[19,1,36],[18,1,37],[18,1,36]],
  rt: -90
},{
  id: 39,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:39'
  }],
  position: [35,2,38],
  action: [[35,1,38],[35,1,37],[34,1,38],[34,1,37]],
  rt: null
},{
  id: 40,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:40'
  }],
  position: [29,2,38],
  action: [[29,1,38],[29,1,37],[28,1,38],[28,1,37]],
  rt: null
},{
  id: 41,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:41'
  }],
  position: [45,2,38],
  action: [[45,1,38],[45,1,37],[44,1,38],[44,1,37]],
  rt: null
},{
  id: 42,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:42'
  }],
  position: [41,2,37],
  action: [[41,1,37],[41,1,36],[40,1,37],[40,1,36]],
  rt: -90
},{
  id: 43,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:43'
  }],
  position: [52,2,38],
  action: [[52,1,38],[52,1,37],[51,1,38],[51,1,37]],
  rt: null
},{
  id: 44,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:44'
  }],
  position: [49,2,38],
  action: [[49,1,38],[49,1,37],[48,1,38],[48,1,37]],
  rt: null
},{
  id: 45,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:45'
  }],
  position: [57,2,38],
  action: [[57,1,38],[57,1,37],[56,1,38],[56,1,37]],
  rt: null
},{
  id: 46,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:46'
  }],
  position: [58,2,33],
  action: [[58,1,33],[58,1,32],[57,1,33],[57,1,32]],
  rt: 90
},{
  id: 47,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:47'
  }],
  position: [58,2,29],
  action: [[58,1,29],[58,1,28],[57,1,29],[57,1,28]],
  rt: 90
},{
  id: 48,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:48'
  }],
  position: [58,2,20],
  action: [[58,1,20],[58,1,19],[57,1,20],[57,1,19]],
  rt: 90
},{
  id: 49,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:49'
  }],
  position: [57,2,14],
  action: [[57,1,14],[57,1,13],[56,1,14],[56,1,13]],
  rt: 90
},{
  id: 50,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:50'
  }],
  position: [58,2,9],
  action: [[58,1,9],[58,1,8],[57,1,9],[57,1,8]],
  rt: 90
},{
  id: 51,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:51'
  }],
  position: [58,2,5],
  action: [[58,1,5],[58,1,4],[57,1,5],[57,1,4]],
  rt: 90
},{
  id: 52,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:52'
  }],
  position: [58,2,1],
  action: [[58,1,1],[58,1,0],[57,1,1],[57,1,0]],
  rt: 90
},{
  id: 53,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:53'
  }],
  position: [58,2,-4],
  action: [[58,1,-4],[58,1,-5],[57,1,-4],[57,1,-5]],
  rt: 90
},{
  id: 54,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:54'
  }],
  position: [57,2,-10],
  action: [[57,1,-10],[57,1,-11],[56,1,-10],[56,1,-11]],
  rt: 90
},{
  id: 55,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:55'
  }],
  position: [56,2,-18],
  action: [[56,1,-18],[56,1,-19],[55,1,-18],[55,1,-19]],
  rt: 180
},{
  id: 56,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:56'
  }],
  position: [52,2,-18],
  action: [[52,1,-18],[52,1,-19],[51,1,-18],[51,1,-19]],
  rt: 180
},{
  id: 57,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:57'
  }],
  position: [50,2,-18],
  action: [[50,1,-18],[50,1,-19],[49,1,-18],[49,1,-19]],
  rt: 180
},{
  id: 58,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:58'
  }],
  position: [44,2,-18],
  action: [[44,1,-18],[44,1,-19],[43,1,-18],[43,1,-19]],
  rt: 180
},{
  id: 59,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:59'
  }],
  position: [35,2,-17],
  action: [[35,1,-17],[35,1,-18],[34,1,-17],[34,1,-18]],
  rt: 180
},{
  id: 60,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:60'
  }],
  position: [39,2,-18],
  action: [[39,1,-18],[39,1,-19],[38,1,-18],[38,1,-19]],
  rt: 180
},{
  id: 61,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:61'
  }],
  position: [24,2,-18],
  action: [[24,1,-18],[24,1,-19],[23,1,-18],[23,1,-19]],
  rt: 180
},{
  id: 62,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:62'
  }],
  position: [31,2,-17],
  action: [[31,1,-17],[31,1,-18],[30,1,-17],[30,1,-18]],
  rt: 180
},{
  id: 63,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:63'
  }],
  position: [15,2,-18],
  action: [[15,1,-18],[15,1,-19],[14,1,-18],[14,1,-19]],
  rt: 180
},{
  id: 64,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:64'
  }],
  position: [11,2,-17],
  action: [[11,1,-17],[11,1,-18],[10,1,-17],[10,1,-18]],
  rt: -90
},{
  id: 65,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:65'
  }],
  position: [20,2,-17],
  action: [[20,1,-17],[20,1,-18],[19,1,-17],[19,1,-18]],
  rt: 90
},{
  id: 66,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:66'
  }],
  position: [7,2,-16],
  action: [[7,1,-16],[7,1,-17],[6,1,-16],[6,1,-17]],
  rt: 90
},{
  id: 67,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:67'
  }],
  position: [7,2,-18],
  action: [[7,1,-18],[7,1,-19],[6,1,-18],[6,1,-19]],
  rt: 90
},{
  id: 68,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:68'
  }],
  position: [-3,2,-17],
  action: [[-3,1,-17],[-3,1,-18],[-4,1,-17],[-4,1,-18]],
  rt: -90
},{
  id: 69,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:69'
  }],
  position: [-17,2,-18],
  action: [[-17,1,-18],[-17,1,-19],[-18,1,-18],[-18,1,-19]],
  rt: -90
},{
  id: 70,
  idx: 0,
  name: 'villager',
  skin: './app/img/skin/villager_01.png',
  speech(){
    return utils.rndArr(dialogue.greetings);
  },
  dialogue: [{
    body: 'id:70'
  }],
  position: [-7,2,-17],
  action: [[-7,1,-17],[-7,1,-18],[-8,1,-17],[-8,1,-18]],
  rt: 90
}]

module.exports = characters;
