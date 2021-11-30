import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Object3D, Quaternion, RepeatWrapping, Vector3 } from "three";
import Visible from "../system/interfaces/Visible";
import Loader from "../system/Loader";

export default class Map implements Visible {

    private readonly SIZE = 500
    private readonly objectGroup : Promise<Group>

    constructor() {

        this.objectGroup = new Promise(resolve => {
            
            const group = new Group()

            // Ground
            const groundTexture = Loader.loadTexture('assets/textures/grass.jpeg')

            groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping
            groundTexture.repeat.set(this.SIZE/20, this.SIZE/20)

            const ground = new Mesh(
                new BoxGeometry(this.SIZE, 1, this.SIZE),
                new MeshStandardMaterial({
                    map: groundTexture
                })
            )

            ground.geometry.rotateX(Math.PI)
            ground.receiveShadow = true
            ground.matrixAutoUpdate = false
            group.add(ground)

            // Walls
            const wallTexture = Loader.loadTexture('assets/textures/wall.jpeg')

            wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping
            wallTexture.repeat.set(12, 2)

            const wall = new Mesh(
                new BoxGeometry(this.SIZE, 40, 10),
                new MeshStandardMaterial({
                    map: wallTexture
                })
            )

            wall.receiveShadow = true
            wall.matrixAutoUpdate = false

            // Top
            const wallTop = wall.clone()
            wallTop.position.set(0, 0, -this.SIZE/2)
            wallTop.updateMatrix()
            group.add(wallTop)

            // Bottom
            const wallBottom = wallTop.clone()
            wallBottom.position.set(0, 0, this.SIZE/2)
            wallBottom.updateMatrix()
            group.add(wallBottom)

            // Left
            const wallLeft = wallTop.clone()
            wallLeft.position.set(-this.SIZE/2, 0, 0)
            wallLeft.rotateY(Math.PI/2)
            wallLeft.updateMatrix()
            group.add(wallLeft)

            // Right
            const wallRight = wallLeft.clone()
            wallRight.position.set(this.SIZE/2, 0, 0)
            wallRight.updateMatrix()
            group.add(wallRight)

            resolve(group)
        })
    }

    setPosition(_: Vector3): void {
        throw new Error("Method not implemented.");
    }
    getPosition(): Vector3 {
        throw new Error("Method not implemented.");
    }
    setRotation(_: Quaternion): void {
        throw new Error("Method not implemented.");
    }
    getRotation(): Quaternion {
        throw new Error("Method not implemented.");
    }

    getObject(): Promise<Object3D | Group> {
        return this.objectGroup  
    }
}