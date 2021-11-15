import { Group, Object3D } from "three";

export default interface Visible {
    getObject() : Promise<Object3D | Group>
}