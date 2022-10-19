import type { Pane, InputBindingApi } from 'tweakpane'
import * as THREE from 'three'

const enum colliderTypes {
  NONE,
  BOX,
  SPHERE
}

interface Params {
  colliderType: colliderTypes;
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

  if (params.colliderType === colliderTypes.BOX) {

    if (!collider) {
      const geo = new THREE.BoxGeometry(size, size, size)
      const mat = new THREE.MeshBasicMaterial()
      mat.transparent = true
      mat.opacity = opacity
      collider = new THREE.Mesh(geo, mat)
      collider.name = 'collider'
      collider.userData.type = colliderTypes.BOX
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

  } else if (params.colliderType === colliderTypes.SPHERE) {

    if (!collider) {
      const geo = new THREE.SphereGeometry(size)
      const mat = new THREE.MeshBasicMaterial()
      mat.transparent = true
      mat.opacity = opacity
      collider = new THREE.Mesh(geo, mat)
      collider.name = 'collider'
      collider.userData.type = colliderTypes.SPHERE
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
  const posInput = pane.addInput(object3D, 'position', { min: -5, max: 5, step: 0.05 })
  const rotInput = pane.addInput(object3D, 'rotation', { step: 0.05 })
  const collider = object3D.getObjectByName('collider') as THREE.Mesh

  const params = {
    colliderType: collider ? collider.userData.type : colliderTypes.NONE,
    radius: 0,
    extents: { x: 0, y: 0, z: 0 },
  }

  pane.addInput(params, 'colliderType', {
    options: {
      none: colliderTypes.NONE,
      box: colliderTypes.BOX,
      sphere: colliderTypes.SPHERE,
    }
  }).on('change', () => {
    if (collider) object3D.remove(collider)
    if (colliderInput) colliderInput.dispose()

    colliderInput = addColliderInputs(object3D, pane, params, undefined!)
  })

  let colliderInput = addColliderInputs(object3D, pane, params, collider)

  return () => {
    colliderInput?.dispose()
    posInput.dispose()
    rotInput.dispose()
  }
}
