import Actionable from "./interfaces/Actionable";
import { Action } from "./interfaces/Enumerations";

export default class ControlHandler {

    private readonly KEYDOWN_MAPPINGS : {[key:string]: Action} = {
        'ArrowDown': Action.DOWN_PRESSED,
        'ArrowUp': Action.UP_PRESSED,
        'ArrowLeft': Action.LEFT_PRESSED,
        'ArrowRight': Action.RIGHT_PRESSED,
        'KeyS': Action.DOWN_PRESSED,
        'KeyW': Action.UP_PRESSED,
        'KeyA': Action.LEFT_PRESSED,
        'KeyD': Action.RIGHT_PRESSED,
        'Enter': Action.ACTION_PRESSED
    }

    private readonly KEYUP_MAPPINGS : {[key:string]: Action} = {
        'ArrowDown': Action.DOWN_RELEASED,
        'ArrowUp': Action.UP_RELEASED,
        'ArrowLeft': Action.LEFT_RELEASED,
        'ArrowRight': Action.RIGHT_RELEASED,
        'KeyS': Action.DOWN_RELEASED,
        'KeyW': Action.UP_RELEASED,
        'KeyA': Action.LEFT_RELEASED,
        'KeyD': Action.RIGHT_RELEASED,
        'Enter': Action.ACTION_RELEASED
    }

    private readonly actionables : Actionable[]

    constructor(actionables : Actionable[]) {
        this.actionables = actionables
    }

    setUpListeners() {
        this.setUpEventListener('keydown', this.KEYDOWN_MAPPINGS)
        this.setUpEventListener('keyup', this.KEYUP_MAPPINGS)
    }

    private setUpEventListener(eventName : string, mapping : {[key:string]: Action}) {
        window.addEventListener(eventName, event => {

            if (event.defaultPrevented)
                return
            
            this.notify(mapping[(<any>event).code])
        }, true)
    }

    private notify(action? : Action) {
        if (action != undefined)
            this.actionables.forEach(o => o.onEvent(action))
    }
}