const THREE = require('./three');

function Mesh(data, mesher, scaleFactor, three) {
  this.THREE = three || THREE
  this.data = data;
  let geometry = this.geometry = new this.THREE.Geometry();
  this.scale = scaleFactor || new this.THREE.Vector3(10, 10, 10);

  let result = mesher(data.voxels, data.dims),
  q,i;
  this.meshed = result;

  geometry.vertices.length = 0
  geometry.faces.length = 0

  for (i = 0; i < result.vertices.length; ++i) {
    q = result.vertices[i]
    geometry.vertices.push(new this.THREE.Vector3(q[0], q[1], q[2]))
  }

  for (i = 0; i < result.faces.length; ++i) {
    geometry.faceVertexUvs[0].push(this.faceVertexUv(i))

    q = result.faces[i]
    if (q.length === 5) {
      geometry.faces.push(
        new this.THREE.Face4(q[0], q[1], q[2], q[3], null, new this.THREE.Color(q[4]))
      )
    } else if (q.length == 4) {
      geometry.faces.push(
        new this.THREE.Face3(q[0], q[1], q[2], null, new this.THREE.Color(q[3]))
      )
    }
  }

  geometry.computeFaceNormals()

  // compute vertex colors for ambient occlusion
  let light = new THREE.Color(0xffffff),
  shadow = new THREE.Color(0x505050);

  for (i = 0; i < geometry.faces.length; ++i) {
    q = geometry.faces[i]
    // facing up
    if(q.normal.y === 1) {
      q.vertexColors = [light, light, light, light]
    }
    // facing down
    else if(q.normal.y === -1){
      q.vertexColors = [shadow, shadow, shadow, shadow];
    }
    // facing right
    else if(q.normal.x === 1){
      q.vertexColors = [shadow, light, light, shadow];
    }
    // facing left
    else if(q.normal.x === -1){
      q.vertexColors = [shadow, shadow, light, light];
    }
    // facing backward
    else if(q.normal.z === 1){
      q.vertexColors = [shadow, shadow, light, light];
    }
    // facing forward
    else {
      q.vertexColors = [shadow, light, light, shadow];
    }
  }

  geometry.verticesNeedUpdate = geometry.elementsNeedUpdate = geometry.normalsNeedUpdate = true;

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

}

Mesh.prototype = {
  createWireMesh(hexColor) {
    let wireMaterial = new this.THREE.MeshBasicMaterial({
      color: hexColor || 0xffffff,
      wireframe: true
    });
    wireMesh = new THREE.Mesh(this.geometry, wireMaterial);
    wireMesh.scale = this.scale;
    wireMesh.doubleSided = true;
    this.wireMesh = wireMesh;
    return wireMesh;
  },
  createSurfaceMesh(material) {
    material = material || new this.THREE.MeshNormalMaterial();
    let surfaceMesh = new this.THREE.Mesh(this.geometry, material);
    surfaceMesh.scale = this.scale;
    surfaceMesh.doubleSided = false;
    this.surfaceMesh = surfaceMesh;
    return surfaceMesh;
  },
  addToScene(scene) {
    if(this.wireMesh){
      scene.add(this.wireMesh);
    }
    if(this.surfaceMesh){
      scene.add(this.surfaceMesh);
    }
  },
  setPosition(x, y, z) {
    if(this.wireMesh){
      this.wireMesh.position = new this.THREE.Vector3(x, y, z);
    }
    if(this.surfaceMesh){
      this.surfaceMesh.position = new this.THREE.Vector3(x, y, z);
    }
  },
  faceVertexUv(i) {
    let vs = [
      this.meshed.vertices[i * 4 + 0],
      this.meshed.vertices[i * 4 + 1],
      this.meshed.vertices[i * 4 + 2],
      this.meshed.vertices[i * 4 + 3]
    ],
    spans = {
      x0: vs[0][0] - vs[1][0],
      x1: vs[1][0] - vs[2][0],
      y0: vs[0][1] - vs[1][1],
      y1: vs[1][1] - vs[2][1],
      z0: vs[0][2] - vs[1][2],
      z1: vs[1][2] - vs[2][2]
    },
    size = {
      x: Math.max(Math.abs(spans.x0), Math.abs(spans.x1)),
      y: Math.max(Math.abs(spans.y0), Math.abs(spans.y1)),
      z: Math.max(Math.abs(spans.z0), Math.abs(spans.z1))
    },
    width,height;
    if (size.x === 0) {
      if (spans.y0 > spans.y1) {
        width = size.y
        height = size.z
      } else {
        width = size.z
        height = size.y
      }
    }
    if (size.y === 0) {
      if (spans.x0 > spans.x1) {
        width = size.x
        height = size.z
      } else {
        width = size.z
        height = size.x
      }
    }
    if (size.z === 0) {
      if (spans.x0 > spans.x1) {
        width = size.x
        height = size.y
      } else {
        width = size.y
        height = size.x
      }
    }
    if ((size.z === 0 && spans.x0 < spans.x1) || (size.x === 0 && spans.y0 > spans.y1)) {
      return [
        new this.THREE.Vector2(height, 0),
        new this.THREE.Vector2(0, 0),
        new this.THREE.Vector2(0, width),
        new this.THREE.Vector2(height, width)
      ]
    } else {
      return [
        new this.THREE.Vector2(0, 0),
        new this.THREE.Vector2(0, height),
        new this.THREE.Vector2(width, height),
        new this.THREE.Vector2(width, 0)
      ]
    }
  }
}

module.exports = function(data, mesher, scaleFactor, three) {
  return new Mesh(data, mesher, scaleFactor, three)
}

module.exports.Mesh = Mesh
