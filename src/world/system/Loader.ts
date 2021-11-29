import { Texture, TextureLoader, Cache, Group, LoadingManager } from "three"
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader"
import {GLTFLoader, GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {TGALoader} from 'three/examples/jsm/loaders/TGALoader'

Cache.enabled = true

class Loader {

    private readonly objectLoader : GLTFLoader
    //private readonly fbxLoader : FBXLoader
    private readonly textureLoader : TextureLoader
    private readonly fontLoader : FontLoader

    constructor() {

        this.objectLoader = new GLTFLoader()

        //const manager = new LoadingManager();
        //manager.addHandler( /\.tga$/i, new TGALoader() );
        //this.fbxLoader = new FBXLoader(manager)

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
