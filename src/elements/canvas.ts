import { renderer } from 'three-kit'
import { Container } from '../treeview/container'

renderer.setClearColor(0xFFFFFF)

export const canvas = new Container()
canvas.resizable = 'right'
canvas.resizeMin = 0
canvas.resizeMax = Infinity
canvas.dom.setAttribute('style', `
  float: left;
  position: relative;
  height: 100vh;
`)
canvas.dom.style.width = `${(window.innerWidth * 3) / 4}px`

renderer.domElement.setAttribute('style', `
  width: 100% !important;
  height: 100% !important;
`)
canvas.dom.append(renderer.domElement)
