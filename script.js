import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

console.log(gsap)


// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Clock
// const clock = new THREE.Clock()

// Animations
gsap.to(mesh.position,{ duration: 1, delay: 1, x: 2})
gsap.to(mesh.position,{ duration: 1, delay: 2, x: 0})
gsap.to(mesh.position,{ duration: 1, delay: 3, x: -2})
gsap.to(mesh.position,{ duration: 1, delay: 4, x: 0})
const tick = () => 
{   
    // Time
    // const elapsedTime = clock.getElapsedTime()

    // Update object
    // mesh.rotation.x = Math.cos(elapsedTime)
    // mesh.rotation.y = Math.sin(elapsedTime)
    // mesh.position.x = Math.cos(elapsedTime)
    // mesh.position.y = Math.sin(elapsedTime)
    // camera.lookAt(mesh.position , mesh.rotation)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
