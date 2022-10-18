import { Pane } from 'tweakpane'
import { addTransformInputs } from './transform'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { controls } from '../elements/controls'

type Disposer = () => void

export const addObjectInputs = (object3D: THREE.Object3D) => {

  const pane = new Pane({ container: controls.dom })

  const disposers: Disposer[] = []

  disposers.push()
  disposers.push(addTransformInputs(pane, object3D))

  return () => {
    for (let i = 0, l = disposers.length; i < l; i += 1) {
      disposers[i]()
    }
    pane.dispose()
  }
}
