import { Container } from '../treeview/container'
import { Pane } from 'tweakpane'
import { scene, update } from 'three-kit'
import * as THREE from 'three'
import { addForwardHelper } from '../inputs/forward'

export const controls = new Container()
controls.dom.classList.add('relative', 'h-screen', 'w-auto', 'min-w-[300px]', 'bg-white')
controls.dom.setAttribute('style', `
  overflow-x: hidden;
  overflow-y: scroll;
`)

const pane = new Pane({ container: controls.dom })

const params = {
  component: '',
};

const meshes: THREE.Mesh[] = []

const select = pane.addInput(params, 'component', {
  label: 'add component',
  options: {
    '': '',
    'myBase (base)': 'myBase (base)',
    'myArm (arm)': 'myArm (arm)',
    'myCamera (camera)': 'myCamera (camera)',
  },
}).on('change', () => {
  if (params.component === '') {
    return
  }

  const object = new THREE.Object3D()
  object.name = params.component

  const size = 0.05
  const geo = new THREE.OctahedronGeometry(size)
  const mat = new THREE.MeshStandardMaterial()
  mat.transparent = true
  mat.opacity = 0.75
  const mesh = new THREE.Mesh(geo, mat)
  object.add(mesh)

  const geometry = new THREE.OctahedronGeometry(size)
  const edges = new THREE.EdgesGeometry( geometry )
  const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
  mesh.add( line )

  addForwardHelper(object)

  meshes.push(mesh)

  scene.add(object)

  params.component = ''
  select.refresh()
});

update(() => {
  
})

pane.addSeparator()