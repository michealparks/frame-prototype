export const enum geometries {
  NONE,
  BOX,
  SPHERE
}

export interface Translation {
  x: number
  y: number
  z: number
}

export interface Quaternion {
  type: 'quaternion'
  value: {
    x: number
    y: number
    z: number
    w: number
  }
}

interface BoxGeometry {
  x: number
  y: number
  z: number
  translation: Translation
}

interface SphereGeometry {
  r: number
  translation: Translation
}

export interface Component {
  name: string
  type: string
  model: string
  frame?: {
    parent: string
    translation: Translation,
    orientation: Quaternion,
    geometry?: BoxGeometry | SphereGeometry
  }
}

export interface Config {
  components: Component[]
}
