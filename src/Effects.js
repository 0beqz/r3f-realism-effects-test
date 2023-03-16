import { useThree, useFrame } from '@react-three/fiber'
import { EffectComposer, RenderPass, EffectPass, FXAAEffect } from 'postprocessing'
import { useEffect, useState } from 'react'
import { SSGIEffect, VelocityDepthNormalPass, TRAAEffect, MotionBlurEffect } from 'realism-effects'
import { useControls } from 'leva'
import { NoToneMapping, sRGBEncoding } from 'three'

export function Effects() {
  const config = useControls({
    distance: { value: 4, min: 0, max: 10 },
    thickness: { value: 6, min: 0, max: 10 },
    autoThickness: false,
    maxRoughness: { value: 1, min: 0, max: 10 },
    blend: { value: 0.95, min: 0, max: 1 },
    denoiseIterations: { value: 3, min: 0, max: 10, step: 1 },
    denoiseKernel: { value: 3, min: 0, max: 10, step: 1 },
    denoiseDiffuse: { value: 25, min: 0, max: 40 },
    denoiseSpecular: { value: 25.54, min: 0, max: 40 },
    depthPhi: { value: 5, min: 0, max: 10 },
    normalPhi: { value: 28, min: 0, max: 40 },
    roughnessPhi: { value: 18.75, min: 0, max: 40 },
    envBlur: { value: 0.55, min: 0, max: 1 },
    importanceSampling: true,
    directLightMultiplier: { value: 1, min: 0, max: 1 },
    maxEnvLuminance: { value: 50, min: 0, max: 100 },
    steps: { value: 20, min: 0, max: 20, step: 1 },
    refineSteps: { value: 4, min: 0, max: 10, step: 1 },
    spp: { value: 1, min: 0, max: 10, step: 1 },
    resolutionScale: { value: 1, min: 0, max: 2, step: 0.5 },
    missedRays: false
  })

  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const [composer] = useState(() => new EffectComposer(gl))
  useEffect(() => composer.setSize(size.width, size.height), [composer, size])
  useEffect(() => {
    gl.outputEncoding = sRGBEncoding
    gl.toneMapping = NoToneMapping
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    const velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera)
    composer.addPass(velocityDepthNormalPass)
    const ssgiEffect = new SSGIEffect(scene, camera, velocityDepthNormalPass, config)
    window.ssgiEffect = ssgiEffect
    const motionBlur = new MotionBlurEffect(velocityDepthNormalPass)
    const effectPass = new EffectPass(camera, ssgiEffect)
    composer.addPass(effectPass)
    
    const traaEffect = new TRAAEffect(scene, camera, velocityDepthNormalPass)
    const effectPass2 = new EffectPass(camera, traaEffect, motionBlur, new FXAAEffect())
    composer.addPass(effectPass2)
    return () => {
      composer.removeAllPasses()
    }
  }, [composer, camera, scene])
  useFrame((state, delta) => {
    gl.autoClear = false // ?
    composer.render(delta)

    if (window.ssgiEffect) {
      for (let prop in config) {
        window.ssgiEffect[prop] = config[prop]
      }
   }

  }, 1)
}
