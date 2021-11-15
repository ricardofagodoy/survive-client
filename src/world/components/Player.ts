import * as TWEEN from '@tweenjs/tween.js'
import { BoxGeometry, ConeBufferGeometry, EventDispatcher, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import Actionable from "../system/interfaces/Actionable";
import { Action } from "../system/interfaces/Enumerations";
import Updatable from "../system/interfaces/Updatable";
import Visible from "../system/interfaces/Visible";
import Loader from '../system/Loader';

export default class Player extends EventDispatcher implements Updatable, Visible, Actionable {

    private mesh! : Object3D
    private promiseMesh : Promise<Object3D>

    private direction : Vector3
    private speed : number

    constructor() {

        super()

        // Load model
        this.promiseMesh = new Promise(async resolve => {

            const gltf = await Loader.loadGLTF('src/assets/models/Male_01_V01.glb')

            const mesh = gltf.scene
    
            mesh.castShadow = true
            mesh.scale.setScalar(10);
            mesh.rotation.y = Math.PI

            mesh.traverse(node => {
                if (node instanceof Mesh)
                    node.castShadow = true
            })

            // Set internal mesh
            this.mesh = mesh

            resolve(this.mesh)
        })

        this.direction = new Vector3(0, 0, 0)
        this.speed = 50
    }

    onEvent(action: Action) {
        
        switch(action) {
            case Action.UP_PRESSED:
                this.direction.z = -1
            break

            case Action.DOWN_PRESSED:
                this.direction.z = 1
            break

            case Action.LEFT_PRESSED:
                this.direction.x = -1
            break

            case Action.RIGHT_PRESSED:
                this.direction.x = 1
            break
            case Action.UP_RELEASED:
                this.direction.z = 0
            break
            case Action.DOWN_RELEASED:
                this.direction.z = 0
            break

            case Action.LEFT_RELEASED:
                this.direction.x = 0
            break

            case Action.RIGHT_RELEASED:
                this.direction.x = 0
            break

            case Action.ACTION_PRESSED:
                this.shoot()
            break
        }
    }

    private shoot() {
        this.dispatchEvent({
            type: 'shoot',
            message: 1
        })
    }

    getObject(): Promise<Object3D> {
        return this.promiseMesh
    }

    tick(delta : number) {

        const pos = this.direction.clone().multiplyScalar(delta).multiplyScalar(this.speed).applyEuler(this.mesh.rotation)

        if(pos.length() > 0) {

            const tween = new TWEEN.Tween({x: this.mesh.position.x, z: this.mesh.position.z})
                        .to({x: pos.x, z: pos.z}, delta)
                        .onUpdate(object => {
                            this.mesh.translateX(object.x)
                            this.mesh.translateZ(object.z)
                        })

            tween.start()
        }
    }
}