import { Color, Fog, Scene } from "three";

export default class GameScene extends Scene {

    constructor() {
        super()
        this.background = new Color('#000')
        //this.fog = new Fog(0x9F9F9F, 10, 400)
    }
}