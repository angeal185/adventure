const vec3 = require('./lib/gl-matrix').vec3

function AABB(pos, vec){
  if(!(this instanceof AABB)){
    return new AABB(pos, vec)
  }

  let pos2 = vec3.create();
  vec3.add(pos2, pos, vec);
  this.base = vec3.min(vec3.create(), pos, pos2);
  this.vec = vec;
  this.max = vec3.max(vec3.create(), pos, pos2);
  this.mag = vec3.length(this.vec);

}

Object.assign(AABB.prototype, {
  width(){
    return this.vec[0]
  },
  height(){
    return this.vec[1]
  },
  depth(){
    return this.vec[2]
  },
  x0(){
    return this.base[0]
  },
  y0(){
    return this.base[1]
  },
  z0(){
    return this.base[2]
  },
  x1(){
    return this.max[0]
  },
  y1(){
    return this.max[1]
  },
  z1(){
    return this.max[2]
  },
  translate(by){
    vec3.add(this.max, this.max, by)
    vec3.add(this.base, this.base, by)
    return this
  },
  expand(aabb){
    let max = vec3.create(),
    min = vec3.create();

    vec3.max(max, aabb.max, this.max);
    vec3.min(min, aabb.base, this.base);
    vec3.sub(max, max, min);

    return new AABB(min, max)
  },
  intersects(aabb){
    if(
      aabb.base[0] > this.max[0] ||
      aabb.base[1] > this.max[1] ||
      aabb.base[2] > this.max[2] ||
      aabb.max[0] < this.base[0] ||
      aabb.max[1] < this.base[1] ||
      aabb.max[2] < this.base[2]
    ){
      return false;
    }
    return true
  },
  touches(aabb){
    let i = this.union(aabb);
    return (i !== null) && ((i.width() == 0) || (i.height() == 0) ||(i.depth() == 0));
  },
  union(aabb){
    if(!this.intersects(aabb)){
      return null;
    }

    let base_x = Math.max(aabb.base[0], this.base[0]),
    base_y = Math.max(aabb.base[1], this.base[1]),
    base_z = Math.max(aabb.base[2], this.base[2]),
    max_x = Math.min(aabb.max[0], this.max[0]),
    max_y = Math.min(aabb.max[1], this.max[1]),
    max_z = Math.min(aabb.max[2], this.max[2])

    return new AABB([base_x, base_y, base_z], [max_x - base_x, max_y - base_y, max_z - base_z])
  }
})

module.exports = AABB;
