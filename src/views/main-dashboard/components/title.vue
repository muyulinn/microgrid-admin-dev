<template>
  <div ref="el" class="title-box" />
</template>

<script>
import * as THREE from 'three'

import { Font } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

THREE.Cache.enabled = true

let camera, cameraTarget, scene, renderer

let group, textMesh1, textMesh2, textGeo, materials

const text = 'JIA HUA'

const bevelEnabled = true

let font

const fontName = 'optimer' // helvetiker, optimer, gentilis, droid sans, droid serif
const fontWeight = 'bold' // normal bold

const height = 20
const size = 100
const hover = 30

const curveSegments = 4

const bevelThickness = 2
const bevelSize = 1.5

const mirror = false

const fontMap = {

  'helvetiker': 0,
  'optimer': 1,
  'gentilis': 2,
  'droid/droid_sans': 3,
  'droid/droid_serif': 4

}

const weightMap = {

  'regular': 0,
  'bold': 1

}

const reverseFontMap = []
const reverseWeightMap = []

for (const i in fontMap) reverseFontMap[ fontMap[ i ] ] = i
for (const i in weightMap) reverseWeightMap[ weightMap[ i ] ] = i

let targetRotation = 0
const targetRotationOnPointerDown = 0

let pointerX = 0
const pointerXOnPointerDown = 0

const windowHalfX = window.innerWidth / 2

function init(container) {
  // CAMERA

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500)
  camera.position.set(0, 400, 500)

  cameraTarget = new THREE.Vector3(0, 50, 0)

  // SCENE

  scene = new THREE.Scene()
  // scene.background = new THREE.Color(0x000000)
  // scene.fog = new THREE.Fog(0x00000000, 250, 1400)

  // LIGHTS

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.125)
  dirLight.position.set(0, 0, 1).normalize()
  scene.add(dirLight)

  const pointLight = new THREE.PointLight(0x3b558d, 1.5)
  // pointLight.color.setHSL(Math.random(), 1, 0.5)
  // pointLight.color.setHSL(0.205, 1, 0.5)
  pointLight.color.setHex(0x98d2fb)

  pointLight.position.set(0, 100, 90)
  scene.add(pointLight)

  materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
  ]

  group = new THREE.Group()
  group.position.y = 100

  scene.add(group)

  loadFont()

  // const plane = new THREE.Mesh(
  //   new THREE.PlaneGeometry(10000, 10000),
  //   new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
  // )
  // plane.position.y = 100
  // plane.rotation.x = -Math.PI / 2
  // scene.add(plane)

  // RENDERER

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(500, 200)
  container.appendChild(renderer.domElement)

  // EVENTS

  // container.style.touchAction = 'none'
  // container.addEventListener('pointerdown', onPointerDown)
  container.addEventListener('pointermove', onPointerMove)
  // container.addEventListener('pointerup', onPointerUp)
  // document.addEventListener('keypress', onDocumentKeyPress)
  // document.addEventListener('keydown', onDocumentKeyDown)

  //

  // const params = {
  //   changeColor: function() {
  //     pointLight.color.setHSL(Math.random(), 1, 0.5)
  //   },
  //   changeFont: function() {
  //     fontIndex++

  //     fontName = reverseFontMap[ fontIndex % reverseFontMap.length ]

  //     loadFont()
  //   },
  //   changeWeight: function() {
  //     if (fontWeight === 'bold') {
  //       fontWeight = 'regular'
  //     } else {
  //       fontWeight = 'bold'
  //     }

  //     loadFont()
  //   },
  //   changeBevel: function() {
  //     bevelEnabled = !bevelEnabled

  //     refreshText()
  //   }
  // }

  //

  // const gui = new GUI()

  // gui.add(params, 'changeColor').name('change color')
  // gui.add(params, 'changeFont').name('change font')
  // gui.add(params, 'changeWeight').name('change weight')
  // gui.add(params, 'changeBevel').name('change bevel')
  // gui.open()

  //
  // makeCurve()
  // window.addEventListener('resize', onWindowResize)
}

// function onPointerDown(event) {
//   if (event.isPrimary === false) return

//   pointerXOnPointerDown = event.clientX - windowHalfX
//   targetRotationOnPointerDown = targetRotation

//   document.addEventListener('pointermove', onPointerMove)
//   document.addEventListener('pointerup', onPointerUp)
// }

function onPointerMove(event) {
  if (event.isPrimary === false) return

  pointerX = event.clientX - windowHalfX

  targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.002
}

// function onPointerUp() {
//   if (event.isPrimary === false) return

//   document.removeEventListener('pointermove', onPointerMove)
//   document.removeEventListener('pointerup', onPointerUp)
// }

// function onWindowResize() {
//   windowHalfX = window.innerWidth / 2

//   camera.aspect = window.innerWidth / window.innerHeight
//   camera.updateProjectionMatrix()

//   renderer.setSize(window.innerWidth, window.innerHeight)
// }

function loadFont() {
  const response = require('three/examples/fonts/' + fontName + '_' + fontWeight + '.typeface.json')
  font = new Font(response)
  refreshText()
}

function createText() {
  textGeo = new TextGeometry(text, {
    font: font,
    size: size,
    height: height,
    curveSegments: curveSegments,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: bevelEnabled

  })

  textGeo.computeBoundingBox()

  const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)

  textMesh1 = new THREE.Mesh(textGeo, materials)

  textMesh1.position.x = centerOffset
  textMesh1.position.y = hover
  textMesh1.position.z = 0

  textMesh1.rotation.x = 0
  textMesh1.rotation.y = Math.PI * 2

  group.add(textMesh1)

  if (mirror) {
    textMesh2 = new THREE.Mesh(textGeo, materials)

    textMesh2.position.x = centerOffset
    textMesh2.position.y = -hover
    textMesh2.position.z = height

    textMesh2.rotation.x = Math.PI
    textMesh2.rotation.y = Math.PI * 2

    group.add(textMesh2)
  }
}

function refreshText() {
  group.remove(textMesh1)
  if (mirror) group.remove(textMesh2)

  if (!text) return

  createText()
}

//

function animate() {
  requestAnimationFrame(animate)
  render()
}

// let curve = null
// function makeCurve() {
//   // Create a closed wavey loop
//   curve = new THREE.CatmullRomCurve3([
//     new THREE.Vector3(-500, 0, -500),
//     new THREE.Vector3(0, 0, 0),
//     new THREE.Vector3(500, 0, -500),
//     new THREE.Vector3(0, 0, -800),
//     new THREE.Vector3(-500, 0, -1000)

//   ])
//   // curve.curveType = 'catmullrom'
//   curve.closed = true// 设置是否闭环
//   curve.tension = 0.5
// }

// let progress = 0 // 物体运动时在运动路径的初始位置，范围0~1
// const velocity = 0.005 // 影响运动速率的一个值，范围0~1，需要和渲染频率结合计算才能得到真正的速率
// // 物体沿线移动方法
// function moveOnCurve() {
//   if (progress <= 1 - velocity) {
//     const point = curve.getPointAt(progress) // 获取样条曲线指定点坐标
//     const pointBox = curve.getPointAt(progress + velocity) // 获取样条曲线指定点坐标

//     if (point && pointBox) {
//       group.position.set(point.x, point.y, point.z)
//       // var targetPos = pointBox // 目标位置点
//       // var offsetAngle = 0 // 目标移动时的朝向偏移

//       // var mtx = new THREE.Matrix4() // 创建一个4维矩阵
//       // mtx.lookAt(model.position, targetPos, model.up) // 设置朝向
//       // mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, offsetAngle, 0)))
//       // // var toRot = new THREE.Quaternion().setFromRotationMatrix(mtx) // 计算出需要进行旋转的四元数值
//       // // model.quaternion.slerp(toRot, 0.2)
//     }

//     progress += velocity
//   } else {
//     progress = 0
//   }
// }
let t = 0.001
function render() {
  if (targetRotation > 0.1 && t > 0) {
    t = -0.001
  }
  if (targetRotation < -0.1 && t < 0) {
    t = 0.001
  }
  targetRotation += t
  group.rotation.y += (targetRotation - group.rotation.y) * 0.05
  group.position.y = 0
  group.position.x = 10
  group.position.z = -100
  camera.lookAt(cameraTarget)

  renderer.clear()
  renderer.render(scene, camera)
}
export default {
  mounted() {
    init(this.$refs.el)
    // renderer.setSize(400, 400)
    animate()
  }
}
</script>

<style lang="less" scoped>
.title-box{
  position: fixed;
  z-index: 20;
  opacity: .8;
}
</style>
