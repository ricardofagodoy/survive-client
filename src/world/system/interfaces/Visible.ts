import { Group, Object3D, Quaternion, Vector3 } from "three";

export default interface Visible {
    getObject() : Promise<Object3D | Group>

    setPosition(position : Vector3) : void
    getPosition() : Vector3

    setRotation(rotation : Quaternion) : void
    getRotation() : Quaternion
}