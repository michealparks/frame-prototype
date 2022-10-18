import { renderer } from 'three-kit'
import { Container } from '../treeview/container'

renderer.setClearColor(0xFFFFFF)

export const canvas = new Container()
canvas.resizable = 'right'
canvas.resizeMax = Infinity
canvas.dom.setAttribute('style', `
  position: relative;
  width: 100%;
  height: 100vh;
  min-width: 500px;
`)

renderer.domElement.setAttribute('style', `
  width: 100% !important;
  height: 100% !important;
`)
canvas.dom.append(renderer.domElement)
