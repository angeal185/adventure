const tpl = require('./tpl'),
names = require('../data/names'),
models = require('../data/models'),
fs = require('fs');

const utils = {
  build(){
    document.body.append(
      tpl.build(this, names)
    )
  },
  rand(min, max) {
    return Math.random() * (max - min) + min;
  },
  rndArr(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  },
  nameGen(){
    let first = this.rndArr(names),
    last = this.rndArr(names);
    if(first !== last){
      return first +' '+ last;
    } else {

      return this.nameGen();
    }

  },
  addChar(obj,cb){
    let lvl = localStorage.getItem('lvl') || '0',
    src = './admin/data/lvl_'+ lvl +'/characters.json';

    if(typeof obj.name !== 'string' || obj.name === ''){
      cb('invalid name')
    }

    if(typeof obj.g !== 'number'){
      cb('invalid gold')
    }

    if(typeof obj.rt !== 'number'){
      cb('invalid rotation')
    }

    if(typeof obj.action !== 'object' || typeof obj.position !== 'object'){
      cb('invalid action')
    }

    fs.readFile(src, 'utf8', function(err,res){
      if(err){return cb(err)}
      res = jp(res);
      obj.id = res.length + 1;
      res.push(obj);
      fs.writeFile(src, js(res), function(err){
        if(err){return cb(err)}
        utils.buildChars(function(err){
          if(err){return cb(err)}
          cb(false)
        })
      })
    })

  },
  addGold(){
    return Math.floor(this.rand(0,100))
  },
  buildChars(cb){
    let lvl = localStorage.getItem('lvl') || '0'
    fs.readFile('./admin/data/lvl_'+ lvl +'/characters.json', 'utf8', function(err,res){
      if(err){return cb(err)}
      res = jp(res);
      let str = '';
      for (let i = 0; i < res.length; i++) {
        str+= models.characters.item
        .replace(/{{id}}/g, res[i].id)
        .replace('{{name}}', res[i].name)
        .replace('{{position}}', js(res[i].position))
        .replace('{{action}}', js(res[i].action))
        .replace('{{rt}}', res[i].rt)
        .replace('{{gold}}', res[i].g)
      }
      str = str.slice(0,-1);
      str = models.characters.frame.replace('{{items}}',str);
      fs.writeFile('./app/data/lvl_'+ lvl +'/characters.js', str, function(err){
        if(err){return cb(err)}
        cb(false)
      })
    })
  }
}


/*
utils.buildChars(function(err){
  if(err){return cl(err)}
  cl('success');
})
*/

module.exports = utils;
