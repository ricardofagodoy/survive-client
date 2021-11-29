import './style.css'
import Connection from './connection/Connection'
import { World } from './world/World'

// HTML elements
const loading = document.querySelector('.loading') as HTMLElement
const ready = document.querySelector('.ready') as HTMLElement
const newcomer = document.querySelector('.newcomer') as HTMLElement

const start = document.getElementById('start') as HTMLElement
const nameInput = document.getElementById('name') as any

// Newcomer
createWorld(nameInput.value || 'Noob')

function createWorld(name : string) {

    // Loading
    newcomer.style.display = 'none'
    ready.style.display = 'block'

    // Connect to server
    ready.textContent = 'Connecting to server, please wait...'

    const connection = new Connection()

    // Bind to HTML element
    const container = document.querySelector('#bg') as HTMLCanvasElement
    const aspect = window.innerWidth / window.innerHeight

    // Build 3D world
    ready.textContent = 'Loading world, please wait...'

    // create a new world
    const world = new World({
        container, 
        aspect
    }, connection)

    // When world ready - click to start!
    world.start(name).then(() => {
        loading.style.display = 'none'
    })
}