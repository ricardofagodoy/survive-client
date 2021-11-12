import { PerspectiveCamera, WebGLRenderer } from "three";

const setSize = (container : HTMLCanvasElement, camera : PerspectiveCamera, renderer : WebGLRenderer) => {

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  }
  
  class Resizer {

    constructor(container : HTMLCanvasElement, camera : PerspectiveCamera, renderer : WebGLRenderer) {
      
      setSize(container, camera, renderer);
  
      window.addEventListener('resize', () => {
        setSize(container, camera, renderer)
        this.onResize()
      });
    }
  
    onResize() {
      console.log('Screen resized but already adjusted')
    }
  }
  
  export { Resizer };
  