import { AmbientLight, DirectionalLight, Light, PointLight } from 'three';

function createLights() : Light[] {

  const ambientLight = new AmbientLight(0xFFFFFF, 3)

  const mainLight = new DirectionalLight(0xFFFFFF, 1.75)
  mainLight.position.set(10, 10, 0)
  mainLight.castShadow = true

  const pointLight = new PointLight('purple', 600, 500 )
  pointLight.position.set(-100, 20, -200)
  pointLight.castShadow = true

  return [ ambientLight, pointLight ]
}

export { createLights }