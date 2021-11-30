import { Object3D, Quaternion, Vector3 } from "three";
import { InputAction, PlayerAction } from "../system/enums/Enumerations";
import { Actionable, InputActionEvent } from "../system/interfaces/Actionable";
import Character from "./Character";

const EMPTY_QUARTENION = new Quaternion()

export default class Player extends Character implements Actionable {

    constructor(name : string, speed? : number, position? : Vector3, rotation? : Quaternion) {
        super(name, speed, position, rotation);

        // Your own name should not display to yourself
        this.getObject().then((mesh : Object3D) => {
            mesh.getObjectByName('nameMesh')?.removeFromParent()
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
                this.rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI/8)
            break

            case InputAction.RIGHT_PRESSED:
                this.rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI/8)
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
                this.rotation = EMPTY_QUARTENION
            break

            // Attack!
            case InputAction.ACTION_PRESSED:
                this.attack()
            break
        }
    }

    move(delta : number) {
        const position = super.move(delta)

        this.dispatchEvent({
            type: PlayerAction.MOVE,
            message: { position }
        })

        return position
    }

    rotate(delta : number) {
        const rotation = super.rotate(delta)

        this.dispatchEvent({
            type: PlayerAction.ROTATE,
            message: { rotation }
        })

        return rotation
    }

    attack() {
        super.attack()

        this.dispatchEvent({
            type: PlayerAction.ATTACK,
            message: {}
        })
    }
}