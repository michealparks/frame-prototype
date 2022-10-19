import { getConfig } from './store'
import { scene } from 'three-kit'
import { geometries } from './types'

const createTranslation = (input: THREE.Vector3) => {
  return {
    x: input.x,
    y: input.y,
    z: input.z,
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
    orientation: {
      type: 'quaternion' as const,
      value: {
        x: quaterion.x,
        y: quaterion.y,
        z: quaterion.z,
        w: quaterion.w,
      },
    }
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
