import { Texture, TextureLoader, Cache } from "three"
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader"
import {GLTFLoader, GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js'

Cache.enabled = true

class Loader {

    private readonly objectLoader : GLTFLoader
    private readonly textureLoader : TextureLoader
    private readonly fontLoader : FontLoader

    constructor() {

        this.objectLoader = new GLTFLoader()
        this.textureLoader = new TextureLoader()
        this.fontLoader = new FontLoader()

        console.log('Loaders constructed')
    }

    loadGLTF(path : string) : Promise<GLTF> {
        return new Promise((resolve, reject) => {
            this.objectLoader.load(path, 
                object => this.onLoad(object, resolve), 
                undefined, 
                (error) => this.onError(error, reject)
            )
        })
    }

    loadTexture(path : string) : Texture {
        return this.textureLoader.load(path)
    }

    loadFont(path : string) : Promise<Font> {
        return this.fontLoader.loadAsync(path)
    }

    private onLoad(result : any, resolve : Function) {
        resolve(result)
    }

    private onError(error : any, reject : Function) {
        console.log('Error while loading: ' + error)
        reject(error)
    }
}

export default new Loader()
