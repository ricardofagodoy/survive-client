import './style.css'
import { World } from './world/World'

// Bind to HTML element
const container = document.querySelector('#bg') as HTMLCanvasElement
const aspect = window.innerWidth / window.innerHeight

// create a new world
const world = new World(container, aspect, {
    DEBUG: false
})

// start the animation loop
world.start()