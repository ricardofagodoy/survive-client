import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Object3D, RepeatWrapping } from "three";
import Visible from "../system/interfaces/Visible";
import Loader from "../system/Loader";

export default class Map implements Visible {

    //private readonly OBJECT_FILE = 'src/world/models/ground.json'
    //private object: Object3D | undefined

    private readonly SIZE = 500
    private readonly objectGroup : Group

    constructor() {

        this.objectGroup = new Group()

        // Ground
        const groundTexture = Loader.loadTexture('src/assets/textures/grass.jpeg')

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
        this.objectGroup.add(ground)

        // Walls
        const wallTexture = Loader.loadTexture('src/assets/textures/wall.jpeg')

        wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping
        wallTexture.repeat.set(12, 2)

        const wall = new Mesh(
            new BoxGeometry(this.SIZE, 40, 10),
            new MeshStandardMaterial({
                map: wallTexture
            })
        )

        wall.receiveShadow = true

        // Top
        const wallTop = wall.clone()
        wallTop.position.set(0, 0, -this.SIZE/2)

        // Bottom
        const wallBottom = wallTop.clone()
        wallBottom.position.set(0, 0, this.SIZE/2)

        // Left
        const wallLeft = wallTop.clone()
        wallLeft.position.set(-this.SIZE/2, 0, 0)
        wallLeft.rotateY(Math.PI/2)

        // Right
        const wallRight = wallLeft.clone()
        wallRight.position.set(this.SIZE/2, 0, 0)
        
        this.objectGroup.add(wallTop)
        this.objectGroup.add(wallBottom)
        this.objectGroup.add(wallLeft)
        this.objectGroup.add(wallRight)
    }

    async getObject(): Promise<Object3D | Group> {
        return this.objectGroup  
    }
}