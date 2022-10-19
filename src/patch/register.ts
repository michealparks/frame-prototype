import { TreeViewItem } from '../treeview/item'
import { treeview, world } from '../elements/treeview'
import { addObjectInputs } from '../inputs/object'

const objectToTreeItem = new WeakMap<THREE.Object3D, TreeViewItem>()
const treeItemToObject = new WeakMap<TreeViewItem, THREE.Object3D>()

let disposer: null | (() => void) = null

treeview.on('select', (item: TreeViewItem) => {
  if (item.text === 'World') {
    return
  }

  const object3D = treeItemToObject.get(item)!
  disposer = addObjectInputs(object3D)
})

treeview.on('reparent', (items: TreeViewItem[]) => {
  for (let { item, newParent } of items) {
    const object = treeItemToObject.get(item)!
    const parent = treeItemToObject.get(newParent)!
    parent.attach(object)
  }
})

treeview.on('deselect', () => {
  disposer?.()
})

export const getFromTreeItem = (item: TreeViewItem) => {
  return treeItemToObject.get(item)!
}

export const deregister = (object3D: THREE.Object3D) => {
  const item = objectToTreeItem.get(object3D)!
  item?.destroy?.()
  objectToTreeItem.delete(object3D)
  treeItemToObject.delete(item)
}

export const register = (object3D: THREE.Object3D) => {
  const isParentScene = (object3D.parent as THREE.Scene | null)?.isScene
  let parent = objectToTreeItem.get(object3D.parent!)

  if (isParentScene) {
    parent = world
  }

  if (parent === undefined) {
    parent = world
  }

  if (object3D.name === '' || object3D.name === 'collider' || object3D.userData.noTree === true) {
    return
  }

  const item = new TreeViewItem({ text: object3D.name })
  objectToTreeItem.set(object3D, item)
  treeItemToObject.set(item, object3D)
  parent.append(item)
}
