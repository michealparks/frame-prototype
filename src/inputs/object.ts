import { Pane } from 'tweakpane'
import { addTransformInputs } from './transform'
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { controls } from '../elements/controls'

type Disposer = () => void

export const addAttributeInputs = (pane: Pane, attributes: any, disposers: any[]) => {
  for (let [key, value] of Object.entries(attributes)) {
    if (typeof value === 'object' && value !== null) {
      
      addAttributeInputs(pane, value, disposers)
    }

    disposers.push(pane.addInput(attributes, key))
  }
}

export const addObjectInputs = (object3D: THREE.Object3D) => {

  const pane = new Pane({ container: controls.dom })
  pane.registerPlugin(RotationPlugin)

  const disposers: Disposer[] = []

  disposers.push()
  disposers.push(addTransformInputs(pane, object3D))

  const slowInterval = { interval: 100_000 }
  const { component } = object3D.userData
  pane.addSeparator()
  pane.addMonitor(component, 'type', slowInterval)
  pane.addMonitor(component, 'model', slowInterval)

  // addAttributeInputs(pane, component.attributes, disposers)

  return () => {
    for (let i = 0, l = disposers.length; i < l; i += 1) {
      disposers[i]()
    }
    pane.dispose()
  }
}
