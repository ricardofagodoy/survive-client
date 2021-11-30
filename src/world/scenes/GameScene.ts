import { Color, Scene } from "three";

export default class GameScene extends Scene {

    constructor() {
        super()
        this.background = new Color('#000')
    }
}