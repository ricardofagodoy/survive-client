import { Action } from "./Enumerations";

export default interface Actionable {
    onEvent(action : Action) : any
}