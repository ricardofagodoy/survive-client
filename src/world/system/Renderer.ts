import { WebGLRenderer } from "three";

function createRenderer(container : HTMLCanvasElement) : WebGLRenderer {

    const renderer = new WebGLRenderer({
        canvas: container,
        antialias: true
      })

    //renderer.shadowMap.enabled = true
    //renderer.shadowMap.type = PCFSoftShadowMap
    renderer.physicallyCorrectLights = true

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    return renderer    
}

export { createRenderer }