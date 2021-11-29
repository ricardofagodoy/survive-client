import { PerspectiveCamera, WebGLRenderer } from "three";

class Resizer {

  constructor(camera: PerspectiveCamera, renderer: WebGLRenderer) {

    window.addEventListener('resize', () => {
      this.setSize(camera, renderer)
      this.onResize()
    });
  }

  setSize(camera: PerspectiveCamera, renderer: WebGLRenderer) {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  onResize() {
    console.log('Screen resized but already adjusted')
  }
}

export { Resizer };