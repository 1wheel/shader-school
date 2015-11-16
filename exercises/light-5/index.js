var mouse        = require('mouse-position')()
var createShader = require('glslify')
var matchFBO     = require('../../lib/match-fbo')
var throttle     = require('frame-debounce')
var dragon       = require('stanford-dragon/3')
var getNormals   = require('mesh-normals')
var fit          = require('canvas-fit')
var getContext   = require('gl-context')
var compare      = require('gl-compare')
var createBuffer = require('gl-buffer')
var createVAO    = require('gl-vao')
var fs           = require('fs')
var now          = require('right-now')
var glm          = require('gl-matrix')
var mat4         = glm.mat4
var vec3         = glm.vec3

var container  = document.getElementById('container')
var canvas     = container.appendChild(document.createElement('canvas'))
var readme     = fs.readFileSync(__dirname + '/README.md', 'utf8')
var gl         = getContext(canvas, render)
var comparison = compare(gl, actual, expected)

comparison.mode = 'slide'
comparison.amount = 0.5

require('../common')({
    description: readme
  , compare: comparison
  , canvas: canvas
  , test: matchFBO(comparison, 0.99)
  , dirname: process.env.dirname
})

window.addEventListener('resize', fit(canvas), false)

var vertexNormals = getNormals(dragon.cells, dragon.positions, 0.1)
var vertexData = []
var vertexCount = dragon.cells.length * 3
for(var i=0; i<dragon.cells.length; ++i) {
  var loop = dragon.cells[i]
  for(var j=0; j<loop.length; ++j) {
    vertexData.push.apply(vertexData, dragon.positions[loop[j]])
  }
}
var vertexBuffer = createBuffer(gl, vertexData)
var normalBuffer = createBuffer(gl, vertexNormals)

var actualShader = createShader({
    frag: process.env.file_fragment_glsl
  , vert: process.env.file_vertex_glsl
})(gl)
actualShader.attributes.position.location = 0
actualShader.attributes.normal.location = 1

var expectedShader = createShader({
    frag: './shaders/fragment.glsl'
  , vert: './shaders/vertex.glsl'
})(gl)
expectedShader.attributes.position.location = 0
expectedShader.attributes.normal.location = 1

var pointShader = createShader({
    frag: './shaders/point-fragment.glsl'
  , vert: './shaders/point-vertex.glsl'
})(gl)
pointShader.attributes.position.location = 0

function getCamera() {
  var projection = mat4.perspective(
    mat4.create(),
    Math.PI/4.0,
    canvas.width/canvas.height,
    0.01,
    1000.0)

  var view = mat4.lookAt(
    mat4.create(),
    [ 100.0*(1.0-2.0 * (mouse.x / canvas.width)), 60.0*(2.0 * (mouse.y / canvas.height) - 1.0), 150.0 ],
    [ 0,0,0],
    [0,1,0])

  var t = 0.001 * now()
  var s = Math.exp(0.5 * Math.cos(t))
  var model = mat4.create()
  //model[0] = 0.5 + 0.5 * s
  //model[5] = 0.5 + 0.5 / s
  model[13] = -60.0 * model[5]

  var eye = [-view[2], -view[6], -view[10]]
  vec3.normalize(eye, eye)

  return {
    model: model,
    view: view,
    projection: projection,
    inverseModel: mat4.invert(mat4.create(), model),
    inverseView: mat4.invert(mat4.create(), view),
    inverseProjection: mat4.invert(mat4.create(), projection),
    ambient: [0.25, 0.25, 0.25],
    lights: [
      {
        position: [ 80*Math.cos(3*t+0.1), 60, 80*Math.sin(3*t+0.1) ],
        diffuse: [0.7, 0, 0],
        specular: [1, 0.8, 0.8],
        shininess: 16
      },
      {
        position: [ 80*Math.cos(1*t+0.5), 60+40*Math.cos(2*t+0.1), 80*Math.sin(1*t+0.5) ],
        diffuse: [0, 0.7, 0],
        specular: [0.8, 1, 0.8],
        shininess: 8
      },
      {
        position: [ 80*Math.cos(0.5*t+0.9), 60+70*Math.cos(5*t+3), 80*Math.sin(0.5*t+0.9) ],
        diffuse: [0, 0, 0.7],
        specular: [0.8, 0.8, 1],
        shininess: 20
      },
      {
        position: [ 80*Math.cos(0.75*t+2), 60+10*Math.cos(0.3*t+5), 80*Math.sin(0.75*t+2) ],
        diffuse: [0.5, 0.5, 0],
        specular: [1, 1, 0.8],
        shininess: 6
      }
    ]
  }
}

var camera

function render() {
  camera = getCamera()
  comparison.run()
  comparison.render()
}

function actual(fbo) {
  fbo.shape = [canvas.height, canvas.width]
  fbo.bind()

  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.depthMask(true)
  gl.depthFunc(gl.LEQUAL)

  actualShader.bind()
  actualShader.uniforms = camera

  if(actualShader.attributes.normal.location > 0) {
    normalBuffer.bind()
    actualShader.attributes.normal.pointer()
  }

  vertexBuffer.bind()
  actualShader.attributes.position.pointer()

  gl.drawArrays(gl.TRIANGLES, 0, vertexCount)

  pointShader.bind()
  pointShader.uniforms.model = camera.model
  pointShader.uniforms.view = camera.view
  pointShader.uniforms.projection = camera.projection
  for(var i=0; i<4; ++i) {
    pointShader.uniforms.lightPosition = camera.lights[i].position
    pointShader.uniforms.diffuse = camera.lights[i].diffuse
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}

function expected(fbo) {
  fbo.shape = [canvas.height, canvas.width]
  fbo.bind()

  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.depthMask(true)
  gl.depthFunc(gl.LEQUAL)
  
  expectedShader.bind()
  expectedShader.uniforms = camera

  normalBuffer.bind()
  expectedShader.attributes.normal.pointer()

  vertexBuffer.bind()
  expectedShader.attributes.position.pointer()

  gl.drawArrays(gl.TRIANGLES, 0, vertexCount)

  pointShader.bind()
  pointShader.uniforms.model = camera.model
  pointShader.uniforms.view = camera.view
  pointShader.uniforms.projection = camera.projection

  vertexBuffer.bind()
  pointShader.attributes.position.pointer()
  for(var i=0; i<4; ++i) {
    pointShader.uniforms.lightPosition = camera.lights[i].position
    pointShader.uniforms.diffuse = camera.lights[i].diffuse
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}