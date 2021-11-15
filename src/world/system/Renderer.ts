import { WebGLRenderer } from "three";

function createRenderer(container : HTMLCanvasElement) : WebGLRenderer {

    const renderer = new WebGLRenderer({
        canvas: container,
        powerPreference: "high-performance",
        antialias: true
      })

    renderer.shadowMap.enabled = true
    renderer.physicallyCorrectLights = true

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    return renderer    
}

export { createRenderer }