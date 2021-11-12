import { PerspectiveCamera } from "three";


function createMainCamera(aspect : number) : PerspectiveCamera {

    const mainCamera = new PerspectiveCamera(75, aspect, 0.1, 1000)
    mainCamera.position.set(200, 30, 10)

    mainCamera.castShadow = true;

    return mainCamera
}

export { createMainCamera }