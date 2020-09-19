var THREE, temporaryPosition, temporaryVector

function View(three, opts) {
  THREE = three // three.js doesn't support multiple instances on a single page
  this.fov = opts.fov;
  this.width = opts.width;
  this.height = opts.height;
  this.aspectRatio = opts.aspectRatio || this.width/this.height
  this.nearPlane = opts.nearPlane;
  this.farPlane = opts.farPlane;
  this.skyColor = opts.skyColor;
  this.ortho = opts.ortho
  this.camera = this.ortho?(new THREE.OrthographicCamera(this.width/-2, this.width/2, this.height/2, this.height/-2, this.nearPlane, this.farPlane)):(new THREE.PerspectiveCamera(this.fov, this.aspectRatio, this.nearPlane, this.farPlane))
  this.camera.lookAt(new THREE.Vector3(0, 0, 0))

  this.createRenderer()
  this.element = this.renderer.domElement
}

View.prototype = {
  createRenderer() {
    let scene = this;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColorHex(this.skyColor, 1.0)
    this.renderer.clear();
    //change sky color
    window.skyChange = function(evt){
      scene.renderer.setClearColorHex(evt, 1.0);
    }

  },
  bindToScene(scene) {
    scene.add(this.camera)
  },
  getCamera() {
    return this.camera
  },
  cameraPosition() {
    temporaryPosition.multiplyScalar(0)
    temporaryPosition.applyMatrix4(this.camera.matrixWorld)
    return [temporaryPosition.x, temporaryPosition.y, temporaryPosition.z]
  },
  cameraVector() {
    temporaryVector.multiplyScalar(0)
    temporaryVector.z = -1
    this.camera.matrixWorld.rotateAxis(temporaryVector)
    return [temporaryVector.x, temporaryVector.y, temporaryVector.z]
  },
  resizeWindow(width, height) {
    if (this.element.parentElement) {
      width = width || this.element.parentElement.clientWidth
      height = height || this.element.parentElement.clientHeight
    }

    this.camera.aspect = this.aspectRatio = width/height
    this.width = width
    this.height = height

    this.camera.updateProjectionMatrix()

    this.renderer.setSize( width, height )
  },
  render(scene) {
    this.renderer.render(scene, this.camera)
  },
  appendTo(element) {
    element.append(this.element)
    this.resizeWindow(this.width,this.height)
  }
}


module.exports = function(three, opts) {
  temporaryPosition = new three.Vector3
  temporaryVector = new three.Vector3
  return new View(three, opts)
}
