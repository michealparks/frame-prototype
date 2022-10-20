import type { Pane, InputBindingApi } from 'tweakpane'
import * as THREE from 'three'
import { Component } from '../config/types'
import { positionToViamTranslation, viamTranslateToPosition } from '../config/coordinates'

/**
 * Arm and gantry problemz
 * cannot add geometry, geometry is added by model json,
 */

const enum geometries {
  NONE,
  BOX,
  SPHERE
}

interface Params {
  geometry: geometries;
  radius: number;
  extents: {
      x: number;
      y: number;
      z: number;
  };
}

const addColliderInputs = (object3D: THREE.Object3D, pane: Pane, params: Params, existing: THREE.Mesh) => {
  let collider: THREE.Mesh = existing
  let colliderInput: InputBindingApi<any, any> | undefined

  const opacity = 0.75
  const size = 0.1

  const updateArrow = () => {
    const arrow = collider?.parent?.getObjectByName('forward') as THREE.ArrowHelper
    arrow?.position.setZ((collider.scale.z / 10) - 0.2)
  }

  if (params.geometry === geometries.BOX) {

    if (!collider) {
      const geo = new THREE.BoxGeometry(size, size, size)
      const mat = new THREE.MeshBasicMaterial()
      mat.transparent = true
      mat.opacity = opacity
      collider = new THREE.Mesh(geo, mat)
      collider.name = 'collider'
      collider.userData.type = geometries.BOX
      object3D.add(collider)

      const geometry = new THREE.BoxGeometry(size, size, size)
      const edges = new THREE.EdgesGeometry( geometry )
      const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
      collider.add( line )
    }

    params.extents.x = size
    params.extents.y = size
    params.extents.z = size

    colliderInput = pane.addInput(params, 'extents', {
      min: 0
    }).on('change', () => {
      collider.scale.x = params.extents.x * 10
      collider.scale.y = params.extents.y * 10
      collider.scale.z = params.extents.z * 10
      updateArrow()
    })

  } else if (params.geometry === geometries.SPHERE) {

    if (!collider) {
      const geo = new THREE.SphereGeometry(size)
      const mat = new THREE.MeshBasicMaterial()
      mat.transparent = true
      mat.opacity = opacity
      collider = new THREE.Mesh(geo, mat)
      collider.name = 'collider'
      collider.userData.type = geometries.SPHERE
      object3D.add(collider)

      const geometry = new THREE.SphereGeometry(size)
      const edges = new THREE.EdgesGeometry( geometry, 5 )
      const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
      collider.add( line )
    }
  
    params.radius = 0

    colliderInput = pane.addInput(params, 'radius').on('change', () => {
      collider.scale.setScalar(params.radius * 10)
      updateArrow()
    })

  }

  return colliderInput
}

export const addTransformInputs = (pane: Pane, object3D: THREE.Object3D) => {
  const collider = object3D.getObjectByName('collider') as THREE.Mesh
  const position = object3D.position.clone()
  positionToViamTranslation(object3D.position, position)

  const params = {
    position,
    rotation: { x: 0, y: 0, z: 0 },
    geometry: collider ? collider.userData.type : geometries.NONE,
    radius: 0,
    extents: { x: 0, y: 0, z: 0 },
  }
  
  const posInput = pane.addInput(params, 'position', {
    min: -5,
    max: 5,
    step: 0.01,
  }).on('change', () => {
    viamTranslateToPosition(params.position, object3D.position)
  })

  const rotInput = pane.addInput(params, 'rotation', {
    step: 0.01
  }).on('change', () => {
    const { x, y, z } = params.rotation
    object3D.rotation.x = -y
    object3D.rotation.y = z
    object3D.rotation.z = x
  })

  const component = object3D.userData.component as Component

  let colliderInput: InputBindingApi<any, any> | undefined

  if (component.type === 'arm' || component.type === 'gantry') {
    pane.addMonitor({
      message: 'arm and gantry geometry is added by model json and cannot be edited'
    }, 'message', {
      multiline: true
    })
  } else {
    pane.addInput(params, 'geometry', {
      options: {
        none: geometries.NONE,
        box: geometries.BOX,
        sphere: geometries.SPHERE,
      }
    }).on('change', () => {
      if (collider) object3D.remove(collider)
      if (colliderInput) colliderInput.dispose()
  
      colliderInput = addColliderInputs(object3D, pane, params, undefined!)
    })  

    colliderInput = addColliderInputs(object3D, pane, params, collider)
  }

  return () => {
    colliderInput?.dispose()
    posInput.dispose()
    rotInput.dispose()
  }
}
