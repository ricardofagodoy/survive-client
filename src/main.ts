import './style.css'
import { World } from './world/World'

// Loading element
const loading = document.querySelector('#loading') as HTMLCanvasElement
const message = document.getElementById('message') as HTMLCanvasElement

message.onclick = () => {
    loading.style.display = 'none'
}

// Bind to HTML element
const container = document.querySelector('#bg') as HTMLCanvasElement
const aspect = window.innerWidth / window.innerHeight

// create a new world
const world = new World(container, aspect, {
    DEBUG: false
})

// When world ready - click to start!
world.start().then(() => {
    message.style.color = 'yellow'
    message.textContent = 'Click here to start!'
})