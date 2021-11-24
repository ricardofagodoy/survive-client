import Actionable from "./interfaces/Actionable";
import { InputAction } from "./enums/Enumerations";

export default class ControlHandler {

    private readonly KEYDOWN_MAPPINGS : {[key:string]: InputAction} = {
        'ArrowDown': InputAction.DOWN_PRESSED,
        'ArrowUp': InputAction.UP_PRESSED,
        'ArrowLeft': InputAction.LEFT_PRESSED,
        'ArrowRight': InputAction.RIGHT_PRESSED,
        'KeyS': InputAction.DOWN_PRESSED,
        'KeyW': InputAction.UP_PRESSED,
        'KeyA': InputAction.LEFT_PRESSED,
        'KeyD': InputAction.RIGHT_PRESSED,
        'Enter': InputAction.ACTION_PRESSED
    }

    private readonly KEYUP_MAPPINGS : {[key:string]: InputAction} = {
        'ArrowDown': InputAction.DOWN_RELEASED,
        'ArrowUp': InputAction.UP_RELEASED,
        'ArrowLeft': InputAction.LEFT_RELEASED,
        'ArrowRight': InputAction.RIGHT_RELEASED,
        'KeyS': InputAction.DOWN_RELEASED,
        'KeyW': InputAction.UP_RELEASED,
        'KeyA': InputAction.LEFT_RELEASED,
        'KeyD': InputAction.RIGHT_RELEASED,
    }

    private readonly actionables : Actionable[]

    constructor(actionables : Actionable[]) {
        this.actionables = actionables
    }

    setUpListeners() {
        this.setUpEventListener('keydown', this.KEYDOWN_MAPPINGS)
        this.setUpEventListener('keyup', this.KEYUP_MAPPINGS)
    }

    private setUpEventListener(eventName : string, mapping : {[key:string]: InputAction}) {
        window.addEventListener(eventName, event => {

            if (event.defaultPrevented)
                return
            
            this.notify(mapping[(<any>event).code])
        }, true)
    }

    private notify(action? : InputAction) {
        if (action != undefined)
            this.actionables.forEach(o => o.onEvent(action))
    }
}