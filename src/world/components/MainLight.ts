import { DirectionalLight, HemisphereLight, Light } from 'three';

function createLights() : Light[] {

  const ambientLight = new HemisphereLight(
    'white',
    'darkslategrey',
    10,
  )

  const mainLight = new DirectionalLight('white', 10)
  mainLight.position.set(0, 100, 0)
  mainLight.castShadow = true;

  return [ mainLight ]
}

export { createLights }
