import { InputAction } from "./enums/Enumerations";
import { Actionable } from "./interfaces/Actionable";

export default class InputControlHandler {

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

        // Keyboard
        this.setUpEventListener('keydown', this.KEYDOWN_MAPPINGS)
        this.setUpEventListener('keyup', this.KEYUP_MAPPINGS)

        // Mouse
        window.addEventListener('mousemove', e => {

            const movement = e.movementX

            if (movement == 0)
                this.notify(InputAction.MOUSE_STOP)
            else
                this.notify((movement < 0 ? InputAction.MOUSE_MOVE_LEFT : InputAction.MOUSE_MOVE_RIGHT), movement)
        })

        window.addEventListener('click', _ => {
            this.notify(InputAction.ACTION_PRESSED)
        })
    }

    private setUpEventListener(eventName : string, mapping : {[key:string]: InputAction}) {
        window.addEventListener(eventName, event => {

            if (event.defaultPrevented)
                return
            
            this.notify(mapping[(<any>event).code])
        }, true)
    }

    private notify(inputAction? : InputAction, value? : number) {
        if (inputAction != undefined)
            this.actionables.forEach(o => o.onEvent({ inputAction, value }))
    }
}