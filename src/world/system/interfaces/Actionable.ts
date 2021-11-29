import { InputAction } from "../enums/Enumerations";

type InputActionEvent = {
    inputAction : InputAction
    value? : number
}

interface Actionable {
    onEvent(inputActionEvent : InputActionEvent) : any
}

export { InputActionEvent, Actionable }