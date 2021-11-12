import { BoxGeometry, Mesh, MeshStandardMaterial, TorusGeometry } from "three";
import Updatable from "../system/interfaces/Updatable";
import Visible from "../system/interfaces/Visible";

export default class Player implements Updatable, Visible {

    private readonly mesh : Mesh
    private readonly speed = 2

    constructor() {
        this.mesh = new Mesh(
            new BoxGeometry(60, 5, 30, 5), 
            new MeshStandardMaterial({color: 0x00})
        )

        this.mesh.castShadow = true
    }
    getMesh(): Mesh {
        return this.mesh
    }

    tick(delta : number) {
        this.mesh.position.y += 0.1
    }
}