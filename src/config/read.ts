import { addForwardHelper } from '../inputs/forward'
import * as THREE from 'three'
import { scene } from 'three-kit'
import type { Config, Component } from './types'
import { setConfig } from './store'
import { viamQuaternionToQuaternion, viamTranslateToPosition } from './coordinates'

const meshes: THREE.Mesh[] = []
const newObjects: THREE.Object3D[] = []

const createEntry = (component: Component) => {
  const object = new THREE.Object3D()
  object.name = component.name
  object.userData.component = component

  if (component.frame !== undefined) {
    viamTranslateToPosition(component.frame.translation, object.position)
    viamQuaternionToQuaternion(component.frame.orientation.value, object.quaternion)
  }

  const size = 0.05
  const geo = new THREE.OctahedronGeometry(size)
  const mat = new THREE.MeshStandardMaterial()
  mat.transparent = true
  mat.opacity = 0.75
  const mesh = new THREE.Mesh(geo, mat)
  object.add(mesh)

  const geometry = new THREE.OctahedronGeometry(size)
  const edges = new THREE.EdgesGeometry( geometry )
  const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
  mesh.add( line )

  addForwardHelper(object)

  meshes.push(mesh)

  newObjects.push(object)
}

const parseText = (text: string): unknown => {
  try { return JSON.parse(text) } catch { return }
}

export const readConfig = async () => {
  const text = await navigator.clipboard.readText()
  const json = parseText(text) as Config | undefined

  scene.clear()

  const grid = new THREE.GridHelper(2, 10, 0x000000, 0x000000)
  scene.add(grid)

  if (json === undefined || Array.isArray(json.components) === false) {
    return window.alert('JSON is not valid')
  }

  if (json.components.length === 0) {
    return window.alert('No components detected')
  }

  for (const component of json.components) {
    createEntry(component)
  }

  for (const object of newObjects) {
    const parentName = object.userData.component.frame?.parent as string | undefined
    if (parentName && parentName?.toLowerCase() !== 'world') {
      scene.getObjectByName(parentName)!.add(object)
    } else {
      scene.add(object)
    }
  }

  setConfig(json)
}
