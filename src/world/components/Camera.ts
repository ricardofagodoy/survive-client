import { Object3D, PerspectiveCamera, Vector3 } from "three";
import Updatable from "../system/interfaces/Updatable";

export default class CustomCamera extends PerspectiveCamera implements Updatable {

    private target! : Object3D
    private readonly distanceFromTarget : Vector3

    constructor(aspect : number) {
        super(20, aspect, 1, 1000)

        this.distanceFromTarget = new Vector3(0, 30, 100)
    }

    setTarget(target : Object3D) {
        this.target = target
    }

    tick(delta: number): void {

        if (this.target) {

            const goal = this.target.position.clone().add(this.distanceFromTarget)
            
            if (this.position.distanceTo(goal) > 0) {
                this.position.lerp(goal, 0.1)
                this.lookAt(this.target.position.clone().add(new Vector3(0, 10, 0)))
            }
        }
    }
}