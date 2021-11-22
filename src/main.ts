import './style.css'
import { World } from './world/World'

// Loading element
const loading = document.querySelector('#loading') as HTMLCanvasElement
loading.style.display = 'none'

const message = document.getElementById('message') as HTMLCanvasElement

// Bind to HTML element
const container = document.querySelector('#bg') as HTMLCanvasElement
const aspect = window.innerWidth / window.innerHeight

// create a new world
const world = new World(container, aspect, {
    DEBUG: false
})

await world.start()

message.style.color = 'yellow'
message.textContent = 'Click here to start!'

message.onclick = () => {
    loading.style.display = 'none'
}