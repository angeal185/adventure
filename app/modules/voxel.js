var chunker = require('./chunker')

module.exports = function(opts) {
  return chunker(opts)
}

module.exports.meshers = {
  culled: require('./meshers/culled').mesher,
}

module.exports.Chunker = chunker.Chunker
module.exports.geometry = {}
module.exports.generator = {}
module.exports.generate = generate

// from https://github.com/mikolalysenko/mikolalysenko.github.com/blob/master/MinecraftMeshes2/js/testdata.js#L4
function generate(l, h, f, game) {
  var d = [ h[0]-l[0], h[1]-l[1], h[2]-l[2] ]
  var v = new Int8Array(d[0]*d[1]*d[2])
  var n = 0
  for(var k=l[2]; k<h[2]; ++k)
  for(var j=l[1]; j<h[1]; ++j)
  for(var i=l[0]; i<h[0]; ++i, ++n) {
    v[n] = f(i,j,k,n,game)
  }
  return {voxels:v, dims:d}
}

module.exports.scale = function ( x, fromLow, fromHigh, toLow, toHigh ) {
  return ( x - fromLow ) * ( toHigh - toLow ) / ( fromHigh - fromLow ) + toLow
}
