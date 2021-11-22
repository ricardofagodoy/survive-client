enum InputAction {
    UP_PRESSED,
    DOWN_PRESSED,
    LEFT_PRESSED,
    RIGHT_PRESSED,
    ACTION_PRESSED,

    UP_RELEASED,
    DOWN_RELEASED,
    LEFT_RELEASED,
    RIGHT_RELEASED,
    ACTION_RELEASED
}

enum PlayerStatus {
    IDLE = 'idle',
    MOVING = 'moving'
}

export { InputAction, PlayerStatus }