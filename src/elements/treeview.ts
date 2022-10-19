import { TreeView } from '../treeview'
import { TreeViewItem } from '../treeview/item'
import { controls } from './controls'

export const treeview = new TreeView()
treeview.resizable = 'bottom'
treeview.dom.style.position = 'relative';
treeview.dom.style.width = '100%';
treeview.dom.style.height = '300px';
controls.append(treeview)

export const world = new TreeViewItem({
  text: 'World',
  class: ['relative'],
})
treeview.append(world)
