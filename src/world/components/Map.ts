import { Group, Matrix4, Mesh, MeshLambertMaterial, MeshStandardMaterial, PlaneGeometry } from "three";
import Visible from "../system/interfaces/Visible";

export default class Map implements Visible {

    private readonly meshGroup

    constructor(width : number, height : number) {

        this.meshGroup = new Group()

        // Floor
        const flootGeometry = new PlaneGeometry(width, height, 50, 50)
        flootGeometry.applyMatrix4(new Matrix4().makeRotationX( - Math.PI / 2 ))

        const floor = new Mesh(flootGeometry, new MeshStandardMaterial({ color: 'darkslategrey' }))
        floor.castShadow = true;
        floor.receiveShadow = true;

        this.meshGroup.add(floor)

        // Walls

        // TODO
    }

    getMesh(): Mesh | Group {
        return this.meshGroup
    }
}