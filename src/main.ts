import './main.css'
import './patch/object3d'
import { canvas } from './elements/canvas'
import { controls } from './elements/controls'
import './elements/treeview'
import * as THREE from 'three'
import { run, scene, camera, renderer, update, lights } from 'three-kit'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

camera.position.set(1, 1, 1)

const light = lights.createDirectional()
light.position.set(1, 1, 1)
scene.add(light)

const grid = new THREE.GridHelper(2, 10, 0x000000, 0x000000)
scene.add(grid)

{
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  update(() => {
    controls.update()
  })
}

document.body.append(canvas.dom)
document.body.append(controls.dom)

run()

