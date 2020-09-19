const fs = require('fs');

const dev = {
  addNpc(i){

    let y = (i[1]);
    let arr = [
      [i[0], y, i[2]],
      [i[0],y, (i[2]-1)],
      [(i[0]-1), y, i[2]],
      [(i[0]-1), y, (i[2]-1)]
    ]
    console.log(JSON.stringify(arr))
  },
  addCrete(i){
    let dest = './app/data/lvl_0/crates.json';
    fs.readFile(dest, 'utf8', function(err,res){
      if(err){return console.log(err)}
      res = JSON.parse(res);
      res.push(i);
      fs.writeFile(dest, JSON.stringify(res),function(err){
        if(err){return console.log(err)}
        console.log('crate added')
      })
    })
  }
}


module.exports = dev;
