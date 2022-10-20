import { renderer } from 'three-kit'
import { Container } from '../treeview/container'

renderer.setClearColor(0xFFFFFF)

export const canvas = new Container()
canvas.resizable = 'right'
canvas.resizeMin = 0
canvas.resizeMax = Infinity
canvas.dom.classList.add('relative', 'float-left', 'h-screen')
canvas.dom.style.width = `${(window.innerWidth * 3) / 4}px`

renderer.domElement.setAttribute('style', `
  width: 100% !important;
  height: 100% !important;
`)
canvas.dom.append(renderer.domElement)
