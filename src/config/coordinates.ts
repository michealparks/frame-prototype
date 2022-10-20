import { Translation, Quaternion } from './types'

export const viamTranslateToPosition = (translation: Translation, position: THREE.Vector3) => {
  position.set(-translation.y, translation.z, translation.x)
}

export const positionToViamTranslation = (position: THREE.Vector3, translation: Translation) => {
  translation.x = position.z
  translation.y = -position.x
  translation.z = position.y
}

export const viamQuaternionToQuaternion = (quat1: Quaternion, quat2: THREE.Quaternion) => {

}
