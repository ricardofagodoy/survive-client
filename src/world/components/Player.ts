// import * as TWEEN from '@tweenjs/tween.js'
import { Mesh, Object3D, Quaternion, Vector3 } from "three";
import Actionable from "../system/interfaces/Actionable";
import { InputAction, PlayerStatus } from "../system/enums/Enumerations";
import Updatable from "../system/interfaces/Updatable";
import Visible from "../system/interfaces/Visible";
import Loader from '../system/Loader';
import GameObject from './GameObject';
import AnimationHandler from '../system/AnimationHandler';

export default class Player extends GameObject implements Updatable, Visible, Actionable {

    private promiseMesh : Promise<Object3D>
    private mesh! : Object3D
    private animationHandler! : AnimationHandler

    // Player stats
    private direction : Vector3
    private rotation : Quaternion
    private speed : number

    constructor() {

        super()

        // Load model
        this.promiseMesh = new Promise(async resolve => {

            // Sword
            const sword = (await Loader.loadGLTF('src/assets/models/sword/scene.gltf')).scene
            sword.scale.setScalar(0.007)
            sword.translateY(-0.25)
            sword.translateX(-0.4)
            sword.translateZ(-0.03)

            // Knight
            const gltf = await Loader.loadGLTF('src/assets/models/knight/knight.gltf')

            const mesh = gltf.scene

            mesh.children[0].rotateY(Math.PI)
    
            mesh.castShadow = true
            mesh.scale.setScalar(10)
            mesh.position.setY(1)

            mesh.traverse(node => {
                if (node instanceof Mesh)
                    node.castShadow = true

                // Add sword to hand
                if (node.name == 'Rig_hand_R')
                    node.add(sword)
            })

            this.mesh = mesh
            
            // Configure animations
            const clips = gltf.animations

            this.animationHandler = new AnimationHandler(mesh, {
                [PlayerStatus.IDLE]: clips[15],
                [PlayerStatus.MOVING]: clips[5],
            }, 2)

            this.animationHandler.play(PlayerStatus.IDLE)

            resolve(this.mesh)
        })

        this.direction = new Vector3(0, 0, 0)
        this.rotation = new Quaternion(0, 0, 0)
        this.speed = 80
    }

    onEvent(action: InputAction) {
        
        switch(action) {

            // Move
            case InputAction.UP_PRESSED:
                this.direction.z = -1
            break

            // Rotate
            case InputAction.LEFT_PRESSED:
                this.rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI/100)
            break
            case InputAction.RIGHT_PRESSED:
                this.rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI/100)
            break

            // Stop moving
            case InputAction.UP_RELEASED:
                this.direction.z = 0
            break
            case InputAction.DOWN_RELEASED:
                this.direction.z = 0
            break
            case InputAction.LEFT_RELEASED:
                this.rotation = new Quaternion()
            break
            case InputAction.RIGHT_RELEASED:
                this.rotation = new Quaternion()
            break
        }

        // Player moved?
        if (this.direction.length() > 0)
            this.move()
        else
            this.idle()
    }

    move() {

        this.animationHandler.play(PlayerStatus.MOVING)

        // Event to server
        this.dispatchEvent({
            type: 'move',
            message: {
                'direction': this.direction,
                'rotation': this.rotation
            }
        })
    }

    idle() {

        this.animationHandler.play(PlayerStatus.IDLE)

        // Event to server
        this.dispatchEvent({
            type: 'idle',
            message: {}
        })
    }

    getObject(): Promise<Object3D> {
        return this.promiseMesh
    }

    tick(delta : number) {

        // Rotate mesh 
        this.mesh.quaternion.multiply(this.rotation)

        // Move
        const pos = this.direction.clone().applyQuaternion(this.mesh.quaternion).multiplyScalar(this.speed * delta)
        
        if(pos.length() > 0)
            this.mesh.position.add(pos)

        // Update animation
        this.animationHandler.tick(delta)
    }
}