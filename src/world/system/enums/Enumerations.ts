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
    ACTION_RELEASED,

    MOUSE_MOVE_LEFT,
    MOUSE_MOVE_RIGHT,
    MOUSE_STOP
}

enum CharacterStatus {
    IDLE = 'idle',
    MOVING = 'moving',
    ATTACKING = 'attacking',
    ATTACKING_SPECIAL = 'attacking_special',
    TAKE_HIT = 'take_hit',
    DIE = 'die'
}

enum PlayerAction {
    MOVE = 'move',
    ROTATE = 'rotate',
    ATTACK = 'attack'
}

export { InputAction, CharacterStatus, PlayerAction }