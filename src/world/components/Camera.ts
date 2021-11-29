import { Object3D, PerspectiveCamera, Vector3 } from "three";
import Updatable from "../system/interfaces/Updatable";

export default class CustomCamera extends PerspectiveCamera implements Updatable {

    private target! : Object3D
    private readonly currentOffset : Vector3
    private readonly currentLookAt : Vector3

    constructor(aspect : number) {
        super(20, aspect, 1, 1000)

        this.currentOffset = new Vector3()
        this.currentLookAt = new Vector3()
    }

    setTarget(target : Object3D) {
        this.target = target
    }

    tick(delta: number): void {

        if (this.target) {

            const goal = new Vector3(0, 40, 150).applyQuaternion(this.target.quaternion).add(this.target.position)
            const lookAtGoal = new Vector3(0, 10, -50).applyQuaternion(this.target.quaternion).add(this.target.position)
            
            if (this.position.distanceTo(goal) > 0) {

                const t = 1.0 - Math.pow(0.001, delta)

                this.currentOffset.lerp(goal, t)
                this.currentLookAt.lerp(lookAtGoal, t)

                this.position.copy(this.currentOffset)
                this.lookAt(this.currentLookAt)
            }
        }
    }
}