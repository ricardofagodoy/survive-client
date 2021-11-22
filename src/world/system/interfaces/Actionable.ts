import { InputAction } from "../enums/Enumerations";

export default interface Actionable {
    onEvent(action : InputAction) : any
}