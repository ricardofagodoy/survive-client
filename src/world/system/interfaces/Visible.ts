import { Group, Mesh } from "three";

export default interface Visible {
    getMesh() : Mesh | Group
}