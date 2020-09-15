module.exports = inherits

function inherits(c, p, proto) {
  proto = proto || {}
  let e = {};
  [c.prototype, proto].forEach(function(s) {
    Object.getOwnPropertyNames(s).forEach(function(k) {
      e[k] = Object.getOwnPropertyDescriptor(s, k)
    })
  })
  c.prototype = Object.create(p.prototype, e)
  c.super = p
}
