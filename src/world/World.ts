// import * as TWEEN from '@tweenjs/tween.js'
import { Clock, Light, Scene, WebGLRenderer, Object3D } from "three";
import CustomCamera from "./components/Camera";
import { createLights } from "./components/Light";
import { createRenderer } from "./system/Renderer";
import { Resizer } from "./system/Resizer";
import Updatable from "./system/interfaces/Updatable";
import GameScene from "./scenes/GameScene";
import Player from "./components/Player";
import Map from "./components/Map";
import Visible from "./system/interfaces/Visible";
import Collidable from "./system/interfaces/Collidable";
import WorldOptions from "./system/interfaces/WorldOptions";
import InputControlHandler from "./system/InputControlHandler";
import { Actionable } from "./system/interfaces/Actionable";
import Connection from "../connection/Connection";
import Character from "./components/Character";

class World {

    private readonly camera : CustomCamera
    private readonly renderer : WebGLRenderer
    private readonly scene : Scene
    private readonly lights : Light[]

    private readonly controlHandler : InputControlHandler

    private readonly clock : Clock
    private readonly updatables : Updatable[]
    private readonly actionables : Actionable[]

    constructor(options : WorldOptions, connection : Connection) {

      this.camera = new CustomCamera(options.aspect)
      this.renderer = createRenderer(options.container)
      this.scene = new GameScene()
      this.lights = createLights()

      this.clock = new Clock()
      this.updatables = []
      this.actionables = []

      this.controlHandler = new InputControlHandler(this.actionables)
      this.controlHandler.setUpListeners()

      // Add light and camera to world
      this.add(...this.lights, this.camera)
          
      // Listener to adapt to screen resizes
      new Resizer(this.camera, this.renderer)
    }

    async setUpWorld(name : string) {

      // Add Map
      const map = new Map()
      await this.add(map)

      // Add player
      const player = new Player(name, 75)
      await this.add(player)

      // Player input events
      // player.addEventListener('move', event => {
      //   console.log('Player move ' + event.message)
      // })

      // Another player
      this.add(new Character('Bob'))

      // Camera to follow player
      player.getObject().then(object => this.camera.setTarget(object))
    }

    async add(...args : (Visible | Collidable | Updatable | Object3D | Actionable)[]) {
      
      for (const arg of args) {

        // If it's visible - add to scene
        if (arg instanceof Object3D)
          this.scene.add(arg)
        
        if ((<Visible>arg).getObject != undefined)
          this.scene.add(await (<Visible>arg).getObject())

        // If it's updatable - add to ticks
        if ((<Updatable>arg).tick != undefined)
          this.updatables.push((<Updatable>arg))

        // If it's actionable from events
        if ((<Actionable>arg).onEvent != undefined)
          this.actionables.push((<Actionable>arg))
      }
    }
  
    async start(name : string) {

        // Construct world
        await this.setUpWorld(name)

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

        // TWEEN.update()

        for (const object of this.updatables)
            object.tick(delta)
    }
  }
  
export { World }