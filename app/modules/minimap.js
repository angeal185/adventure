
function Minimap(){
  let sz = mapStats.sz;

  this.cnv = mapStats.cnv;
  this.cnv.id = 'mini-map';
  this.width = this.cnv.width = sz[0];
  this.height = this.cnv.height = sz[1];
  this.dot = 5
  this.ctx = this.cnv.getContext('2d');
  this.ctx.fillStyle = 'red';
  this.offset = mapStats.offset;
}

Minimap.prototype = {
  pos(e){
    let i = mapStats.pos,
    j = mapStats.home,
    dot = this.dot;
    if(!e){
      e = i;
    } else {
      e = this.resize(e);
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(e[0], e[1], dot, dot);
    this.ctx.fillStyle = 'orange';
    if(!mapStats.home){
      mapStats.home = j = e;
    }
    this.ctx.fillRect(j[0], j[1], dot, dot);
    mapStats.pos = e;

    if(mapStats.mark[0] !== -1){
      j = mapStats.mark;
      this.ctx.fillStyle = 'blue';
      this.ctx.fillRect(j[0], j[1], dot, dot);
    }

    if(mapStats.mission[0] !== -1){
      j = mapStats.mission;
      this.ctx.fillStyle = 'purple';
      this.ctx.fillRect(j[0], j[1], dot, dot);
    }

    if(mapStats.dest[0] !== -1){
      j = mapStats.dest;
      this.ctx.fillStyle = 'cyan';
      this.ctx.fillRect(j[0], j[1], dot, dot);
    }
    return this;
  },
  mark(e){
    mapStats.mark = this.resize(e);
    return this;
  },
  mission(e){
    mapStats.mission = this.resize(e);
    return this;
  },
  dest(e){
    mapStats.dest = this.resize(e);
    return this;
  },
  resize(e){
    let offset = this.offset;
    e[0] = e[0] * 2 + offset[0]
    e[1] = e[1] * 2 + offset[1]
    return e
  }
}


const minimap = new Minimap();

module.exports = minimap;

/*
document.body.append(mapStats.cnv);

function rnd(min, max) {
  return Math.random() * (max - min) + min;
}

minimap
  .mark([rnd(0,200),rnd(0,200)])
  .pos([rnd(0,200),rnd(0,200)])

setInterval(function(){
  minimap.pos([rnd(0,200),rnd(0,200)])
},3000)

setTimeout(function(){
  minimap.dest([rnd(0,200),rnd(0,200)])
  setTimeout(function(){
    minimap.mission([rnd(0,200),rnd(0,200)])
  },3000)
},3000)
*/
