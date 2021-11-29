// import * as TWEEN from '@tweenjs/tween.js'
import { Box3, Group, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { InputAction, PlayerStatus } from "../system/enums/Enumerations";
import Updatable from "../system/interfaces/Updatable";
import Visible from "../system/interfaces/Visible";
import Loader from '../system/Loader';
import GameObject from './GameObject';
import AnimationHandler from '../system/AnimationHandler';
import { Actionable, InputActionEvent } from "../system/interfaces/Actionable";

export default class Player extends GameObject implements Updatable, Visible, Actionable {

    private promiseMesh : Promise<Object3D>
    private mesh! : Object3D
    private animationHandler! : AnimationHandler

    // Player stats
    private name : string
    private direction : Vector3
    private rotation : Quaternion
    private speed : number

    constructor(name : string, speed : number) {

        super()

        this.name = name
        this.speed = speed
        this.direction = new Vector3(0, 0, 0)
        this.rotation = new Quaternion(0, 0, 0)

        // Load model
        this.promiseMesh = new Promise(async resolve => {

            // Sword
            const sword = (await Loader.loadGLTF('assets/models/sword/scene.gltf')).scene
            sword.scale.setScalar(0.007)
            sword.translateY(-0.25)
            sword.translateX(-0.4)
            sword.translateZ(-0.03)

            // Knight
            const gltf = await Loader.loadGLTF('assets/models/knight/knight.gltf')

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
                [PlayerStatus.IDLE]: {clip: clips[15]},
                [PlayerStatus.MOVING]: {clip: clips[5]},
                [PlayerStatus.ATTACKING]: {clip: clips[3], repetitions: 1}
            }, this.speed/50)

            // Status changes
            this.animationHandler.play(PlayerStatus.IDLE)

            this.animationHandler.animationMixer.addEventListener('finished', _ => {
                this.idle()
            })

            // Name
            const nameMesh = new Mesh(
                new TextGeometry(name, {
                    font: await Loader.loadFont('assets/fonts/helvetiker_regular.typeface.json'),
                    size: 30,
                    height: 5
                }),
                new MeshStandardMaterial({color: 'green'})
            )

            const meshGroup = mesh as Group
            meshGroup.add(nameMesh)

            nameMesh.translateY(2.2)

            nameMesh.geometry.computeBoundingBox()
            const width = nameMesh.geometry.boundingBox?.max.x || 0

            nameMesh.translateX(-width/2*0.01)
            nameMesh.scale.setScalar(0.01)

            resolve(this.mesh)
        })
    }

    onEvent(inputActionEvent: InputActionEvent) {
        
        switch(inputActionEvent.inputAction) {

            // Move
            case InputAction.UP_PRESSED:
                this.direction.z = -1
            break
            case InputAction.DOWN_PRESSED:
                this.direction.z = 1
            break

            // Rotate
            case InputAction.LEFT_PRESSED:
                this.rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI/6)
            break

            case InputAction.RIGHT_PRESSED:
                this.rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI/6)
            break

            // Stop moving
            case InputAction.UP_RELEASED:
                this.direction.z = 0
            break
            case InputAction.DOWN_RELEASED:
                this.direction.z = 0
            break

            // Stop rotating
            case InputAction.LEFT_RELEASED:
            case InputAction.RIGHT_RELEASED:
                this.rotation = new Quaternion()
            break
        }

        // Player moved?
        if (this.direction.length() > 0)
            this.move()
        else if (inputActionEvent.inputAction == InputAction.ACTION_PRESSED)
            this.attack()
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

    attack() {

        this.animationHandler.play(PlayerStatus.ATTACKING)

        // Event to server
        this.dispatchEvent({
            type: 'attack',
            message: {}
        })
    }

    getObject(): Promise<Object3D> {
        return this.promiseMesh
    }

    tick(delta : number) {

        // Rotate mesh 
        const newRotation = this.mesh.quaternion.clone().multiply(this.rotation)
        this.mesh.quaternion.slerp(newRotation, 0.1)

        // Move
        const pos = this.direction.clone().applyQuaternion(this.mesh.quaternion).multiplyScalar(this.speed * delta)
        
        if(pos.length() > 0)
            this.mesh.position.add(pos)

        // Update animation
        this.animationHandler.tick(delta)
    }
}