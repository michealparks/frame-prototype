import * as THREE from 'three'
import { getConfig } from './store'
import { scene } from 'three-kit'
import { geometries } from './types'
import { positionToViamTranslation } from './coordinates'

const euler1 = new THREE.Euler()
const euler2 = new THREE.Euler()
const quat = new THREE.Quaternion()

const createTranslation = (position: THREE.Vector3) => {
  const translation = { x: 0, y: 0, z: 0 }
  positionToViamTranslation(position, translation)
  return translation
}

const createRotation = (quaternion: THREE.Quaternion) => {
  euler1.setFromQuaternion(quaternion)
  euler2.x = -euler1.y
  euler2.y = euler1.z
  euler2.z = euler1.x
  quat.setFromEuler(euler2)

  return {
    type: 'quaternion' as const,
    value: {
      x: quat.x,
      y: quat.y,
      z: quat.z,
      w: quat.w,
    },
  }
}

const createFrame = (
  parent: string,
  position: THREE.Vector3,
  quaterion: THREE.Quaternion
) => {
  return {
    parent,
    translation: createTranslation(position),
    orientation: createRotation(quaterion),
  }
}

const createGeometry = (mesh: THREE.Mesh) => {
  if (mesh.userData.type === geometries.BOX) {
    return {
      x: 0.1 * mesh.scale.x,
      y: 0.1 * mesh.scale.y,
      z: 0.1 * mesh.scale.z,
      translation: createTranslation(mesh.position)
    }
  } else {
    return {
      r: 0.1 * mesh.scale.x,
      translation: createTranslation(mesh.position)
    }
  }
}

export const writeConfig = async () => {
  const config = getConfig()

  if (config === undefined) {
    return window.alert('No config loaded!')
  }

  for (const component of config.components) {
    const object3D = scene.getObjectByName(component.name)!
    const { position, quaternion } = object3D
    const collider = object3D.getObjectByName('collider')

    if (
      collider === undefined &&
      position.x === 0 && position.y === 0 && position.z === 0 &&
      quaternion.x === 0 && quaternion.y === 0 && quaternion.z === 0 && quaternion.w === 1
    ) {
      continue
    }

    const parent = 'isScene' in object3D.parent! ? 'world' : object3D.parent!.name

    component.frame = createFrame(parent, position, quaternion)

    if (collider) {
      component.frame.geometry = createGeometry(collider as THREE.Mesh)
    }
  }

  await navigator.clipboard.writeText(JSON.stringify(config))

  window.alert('Config written to clipboard!')
}
