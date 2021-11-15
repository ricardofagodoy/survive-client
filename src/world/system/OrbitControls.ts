import { Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Updatable from './interfaces/Updatable';

class CustomOrbitControls extends OrbitControls implements Updatable {

    constructor(camera : Camera, canvas : HTMLCanvasElement) {
        super(camera, canvas)
        this.enableDamping = true
    }

    tick() {
        this.update()
    }

}
function createControls(camera : Camera, canvas : HTMLCanvasElement) {
  return new CustomOrbitControls(camera, canvas)
}

export { createControls };