import { AnimationAction, AnimationClip, AnimationMixer, Object3D } from "three";
import Updatable from "./interfaces/Updatable";

export default class AnimationHandler implements Updatable {

    private readonly mixer : AnimationMixer
    private readonly animations : {[key: string]: AnimationAction}
    private current : string | undefined

    constructor(object : Object3D, clips : {[key: string]: {clip: AnimationClip, repetitions? : number}}, speed = 1) {
        
        this.mixer = new AnimationMixer(object)
        this.mixer.timeScale = speed

        this.animations = {}

        for (let [key, value] of Object.entries(clips)) {

            const clip = value['clip']
            clip.name = key

            const action = this.mixer.clipAction(clip)
            action.clampWhenFinished = true

            if (value['repetitions'])
                action.repetitions = value['repetitions']

            this.animations[key] = action
        }
    }

    get animationMixer() {
        return this.mixer
    }

    set timeScale(timeScale : number) {
        this.mixer.timeScale = timeScale
    }

    play(status : string) {

        // It's already running!
        if (status == this.current)
            return

        const previous = this.current
        this.current = status

        // Let's play the new animation
        const action = this.animations[status]
        action.reset()

        if (previous)
            action.crossFadeFrom(this.animations[previous], 0.3, false)

        action.play()
    }

    tick(delta: number): void {
        if (this.current)
            this.mixer.update(delta)
    }
}