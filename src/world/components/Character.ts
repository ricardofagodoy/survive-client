import { Group, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { CharacterStatus } from "../system/enums/Enumerations";
import Updatable from "../system/interfaces/Updatable";
import Visible from "../system/interfaces/Visible";
import Loader from '../system/Loader';
import GameObject from './GameObject';
import AnimationHandler from '../system/AnimationHandler';

const EMPTY_QUARTENION = new Quaternion()

export default class Character extends GameObject implements Updatable, Visible {

    // Threejs objects
    private mesh! : Object3D
    private promiseMesh : Promise<Object3D>

    // Animations
    private animationHandler! : AnimationHandler

    // Player stats
    protected direction : Vector3
    protected rotation : Quaternion
    private speed : number
    private status : CharacterStatus
    private canMove : boolean

    constructor(name : string, speed? : number, position? : Vector3, rotation? : Quaternion) {

        super()

        this.speed = speed || 60
        this.rotation = rotation || EMPTY_QUARTENION
        this.direction = new Vector3(0, 0, 0)
        this.status = CharacterStatus.IDLE
        this.canMove = true

        // Load model
        this.promiseMesh = new Promise(async resolve => {

            const obj = await Loader.loadGLTF('assets/models/cartoon/monster.gltf')
            const model = obj.scene

            model.position.copy(position || new Vector3(0, 0, 0))
            model.rotateY(Math.PI)
            model.translateY(1)
            model.scale.setScalar(5)

            // Shadows
            model.castShadow = true

            model.traverse(node => {
                if (node instanceof Mesh)
                    node.castShadow = true
            })

            // Configure animations
            const clips = obj.animations

            // 0 Attack simple
            // 1 Attack special
            // 2 Dead
            // 3 Get hit
            // 4 Idle
            // 5 Idle long
            // 6 Jump
            // 7 Run
            // 8 Walk

            this.animationHandler = new AnimationHandler(model, {
                [CharacterStatus.IDLE]: {clip: clips[5]},
                [CharacterStatus.MOVING]: {clip: clips[7]},
                [CharacterStatus.ATTACKING]: {clip: clips[0], repetitions: 1},
                [CharacterStatus.TAKE_HIT]: {clip: clips[3], repetitions: 1},
                [CharacterStatus.DIE]: {clip: clips[2], repetitions: 1},
                [CharacterStatus.ATTACKING_SPECIAL]: {clip: clips[1], repetitions: 1}
            }, this.speed/50)
        
            // Animation status changes - event when single animation finishes
            this.animationHandler.animationMixer.addEventListener('finished', e => {

                const finishedAnimationName = e.action.getClip().name

                if (finishedAnimationName == 'attacking')
                    this.canMove = true
            })

            // Wrapper
            const mesh = new Group()
            mesh.add(model)
            this.mesh = mesh

            // Nickname mesh
            const nameMesh = new Mesh(
                new TextGeometry(name, {
                    font: await Loader.loadFont('assets/fonts/helvetiker_regular.typeface.json'),
                    size: 30,
                    height: 5
                }),
                new MeshStandardMaterial({color: 'green'})
            )

            mesh.add(nameMesh)
            
            nameMesh.name = 'nameMesh'
            nameMesh.translateY(25)
            nameMesh.rotateY(Math.PI)
            nameMesh.geometry.computeBoundingBox()
            nameMesh.translateX(-(nameMesh.geometry.boundingBox?.max.x || 0)/2*0.1)
            nameMesh.scale.setScalar(0.1)

            resolve(this.mesh)
        })
    }

    setPosition(position: Vector3): void {
        this.mesh.position.copy(position)
    }

    getPosition(): Vector3 {
        return this.mesh.position
    }

    setRotation(rotation: Quaternion): void {
        this.mesh.quaternion.copy(rotation)
    }

    getRotation(): Quaternion {
        return this.mesh.quaternion
    }

    move(delta : number) : Vector3 {

        this.status = CharacterStatus.MOVING

        this.mesh.position.add(
            this.direction.clone()
                          .applyQuaternion(this.mesh.quaternion)
                          .multiplyScalar(this.speed * delta)
        )

        return this.getPosition()
    }

    rotate(delta : number) : Quaternion {

        const newRotation = this.mesh.quaternion.clone().multiply(this.rotation)
        this.mesh.quaternion.slerp(newRotation, 1.0 - Math.pow(0.001, delta))

        return this.getRotation()
    }

    idle(_ : number) {
        this.status = CharacterStatus.IDLE
    }

    attack() {
        this.canMove = false
        this.status = CharacterStatus.ATTACKING
    }

    getObject(): Promise<Object3D> {
        return this.promiseMesh
    }

    tick(delta : number) {

        if (this.canMove) {

            // Rotate 
            if (!this.rotation.equals(EMPTY_QUARTENION))
                this.rotate(delta)

            // Move
            if (this.direction.length() > 0)
                this.move(delta)
            else
                this.idle(delta)
        }

        // Play and update animation
        this.animationHandler.play(this.status)
        this.animationHandler.tick(delta)
    }
}