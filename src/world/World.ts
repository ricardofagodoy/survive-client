import { PerspectiveCamera, Clock, Light, Scene, WebGLRenderer, Object3D, DirectionalLightHelper, DirectionalLight } from "three";
import { createMainCamera } from "./components/MainCamera";
import { createLights } from "./components/MainLight";
import { createRenderer } from "./system/Renderer";
import { createControls } from "./system/Controls";
import { Resizer } from "./system/Resizer";
import Updatable from "./system/interfaces/Updatable";
import GameScene from "./scenes/GameScene";
import Player from "./components/Player";
import Map from "./components/Map";
import Visible from "./system/interfaces/Visible";
import Collidable from "./system/interfaces/Collidable";
import WorldOptions from "./system/interfaces/WorldOptions";

class World {

    private readonly camera : PerspectiveCamera
    private readonly renderer : WebGLRenderer
    private readonly scene : Scene
    private readonly lights : Light[]

    private readonly clock : Clock
    private readonly updatables : Updatable[]

    constructor(container : HTMLCanvasElement, aspect : number, options? : WorldOptions) {

      this.camera = createMainCamera(aspect)
      this.renderer = createRenderer(container)
      this.scene = new GameScene()
      this.lights = createLights()

      this.clock = new Clock()
      this.updatables = []

      // For debug porpose only
      if (options?.DEBUG) {
        const controls = createControls(this.camera, this.renderer.domElement);
        this.add(controls)

        const helper = new DirectionalLightHelper(this.lights[0] as DirectionalLight, 5)
        this.scene.add(helper)
      }
          
      // Add basic lights
      this.add(...this.lights)
          
      // Listener to adapt to screen resizes
      new Resizer(container, this.camera, this.renderer)
    }

    setUpWorld() {

      // Add Map
      const map = new Map(300, 300)
      this.add(map)

      // Add player
      //const player = new Player()
    }

    add(...args : (Visible | Collidable | Updatable | Object3D)[]) {
      
      for (const arg of args) {

        // If it's visible - add to scene
        if (arg instanceof Object3D)
          this.scene.add(arg)
        
        if ((<Visible>arg).getMesh != undefined)
          this.scene.add((<Visible>arg).getMesh())

        // If it's updatable - add to ticks
        if ((<Updatable>arg).tick != undefined)
          this.updatables.push((<Updatable>arg))
      }
    }
  
    start() {

        // Construct world
        this.setUpWorld()

        // Starts updating it periodically
        this.renderer.setAnimationLoop(() => {
            this.tick()
            this.renderer.render(this.scene, this.camera)
        })
    }
  
    stop() {
      this.renderer.setAnimationLoop(null)
    }

    tick() {
        const delta = this.clock.getDelta()

        for (const object of this.updatables)
            object.tick(delta)
    }
  }
  
export { World }