import * as THREE from 'three'

export const addForwardHelper = (object3D: THREE.Object3D) => {
  const length = 0.2
  const color = 0x000000
  const headLength = 0.1
  const headWidth = 0.05
  const helper = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), undefined, length, color, headLength, headWidth)
  helper.name = 'forward'
  helper.userData.noTree = true

  object3D.add(helper)

  return () => {
    object3D.remove(helper)
    // @ts-expect-error exists
    helper.dispose?.()
  }
}
