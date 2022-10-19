import { Container } from '../treeview/container'
import { Pane } from 'tweakpane'
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation'
import { readConfig } from '../config/read'
import { writeConfig } from '../config/write'

export const controls = new Container()
controls.dom.classList.add('relative', 'h-screen', 'w-auto', 'bg-white', 'overflow-x-hidden', 'overflow-y-scroll')

const pane = new Pane({ container: controls.dom })
pane.registerPlugin(RotationPlugin)

pane.addButton({
  title: 'Read Config from Clipboard',
}).on('click', readConfig)

pane.addButton({
  title: 'Write New Config to Clipboard'
}).on('click', writeConfig)

pane.addSeparator()
