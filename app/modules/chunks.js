const ChunkMatrix = require('./lib/chunk_matrix'),
indexer = require('./lib/indexer');

function Group(game) {
    if (!(this instanceof Group)){
      return new Group(game);
    }
    this.meshes = [];
    this.chunkMatricies = [];
    this.game = game;
    this.indexer = indexer(game);
}

Group.prototype = {
  create(generate) {
      let self = this,
      cm = new ChunkMatrix(self.game, generate);
      cm.on('add', function (mesh) {
          self.chunkMatricies[mesh.id] = cm;
          self.meshes.push(mesh);
      });
      cm.on('remove', function (id) {
          delete self.chunkMatricies[id];
      });
      self.chunkMatricies.push(cm);
      return cm;
  },
  createBlock(pos, val) {
      let self = this,
      T = self.game.THREE,
      size = self.game.cubeSize,
      cm = pos.chunkMatrix,
      d = pos.direction,
      mr = new T.Matrix4().getInverse(cm.rotationObject.matrix),
      mt = new T.Matrix4().getInverse(cm.translationObject.matrix),
      m = new T.Matrix4().multiply(mr, mt);

      return (function draw (offset) {
          let pt = new T.Vector3();
          pt.copy(pos);

          pt.x -= d.x * offset;
          pt.y -= d.y * offset;
          pt.z -= d.z * offset;
          offset += size / 8;

          let tr = m.multiplyVector3(pt),
          ci = self.indexer.chunk(tr),
          vi = self.indexer.voxel(tr),
          value = cm.getByIndex(ci, vi);

          if (!value) {
              cm.setByIndex(ci, vi, 3);
              return true;
          } else {
            draw(offset + 0.1)
          }
      })(0)
  },
  setBlock(pos, val) {
      let ix = this.getIndex(pos),
      cm = pos.chunkMatrix;
      return cm.setByIndex(ix.chunk, ix.voxel, val);
  },
  getBlock(pos) {
      let ix = this.getIndex(pos),
      cm = pos.chunkMatrix;
      return cm.getByIndex(ix.chunk, ix.voxel);
  },
  getIndex(pos) {
      let T = this.game.THREE,
      cm = pos.chunkMatrix,
      mr = new T.Matrix4().getInverse(cm.rotationObject.matrix),
      mt = new T.Matrix4().getInverse(cm.translationObject.matrix),
      m = new T.Matrix4().multiply(mt, mr),
      tr = m.multiplyVector3(pos),
      ci = this.indexer.chunk(tr),
      vi = this.indexer.voxel(tr);
      return { chunk: ci, voxel: vi };
  }
}

module.exports = Group;
