import { CameraControls, Environment, Lightformer, ScrollControls, useAnimations, useGLTF, useScroll } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useThree, useFrame } from '@react-three/fiber'
import { LayerMaterial } from "lamina";
import React from "react";
import * as THREE from 'three';
import { Effects } from './Effects';
import { useEffect, useState } from 'react'


export default function App() {
  return (
    <Canvas shadows camera={{ position: [5, 0, 5], zoom: 1 }}>
      <color attach="background" args={['#f0f0f0']} />
      {/* Scroll controls are like orbit controls for scroll */}
      <ScrollControls pages={2}>
        <Model scale={0.1} />
      </ScrollControls>
      {/* Fill light and main light */}
      {/* <hemisphereLight intensity={0.1} />
      <directionalLight position={[2, 8, -5]} castShadow intensity={2} shadow-mapSize={2048} shadow-bias={-0.001}>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 30]} />
      </directionalLight> */}
      {/* The shadow catcher */}

      <Effects />
      {/* The environment map, creates the reflections */}
      <Environment resolution={2048} background>
        <Lightformer
          visible={true}
          form="rect"
          intensity={1}
          position={new THREE.Vector3().setFromSphericalCoords(
            4, // distance
            0.8707963267948957, // phi
            1.5000000000000002 // theta
          )}
          rotation={[0, 0, 0]}
          scale={[18, 4.5, 4.5]}
          target={[0, 0, 0]}
          color="#4379ff"
          castShadow={false}
          receiveShadow={false}
        />

        <Lightformer
          visible={true}
          form="ring"
          intensity={4}
          position={new THREE.Vector3().setFromSphericalCoords(
            4, // distance
            0.9707963267948965, // phi
            3.900000000000001 // theta
          )}
          rotation={[0, 0, 0]}
          scale={[3.700000000000001, 3.700000000000001, 3.700000000000001]}
          target={[0, 0, 0]}
          color="#f5c664"
          castShadow={false}
          receiveShadow={false}
        />

        <Lightformer
          visible={true}
          form="circle"
          intensity={1}
          position={new THREE.Vector3().setFromSphericalCoords(
            4, // distance
            2.070796326794897, // phi
            0 // theta
          )}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
          target={[0, 0, 0]}
          color="#88f086"
          castShadow={false}
          receiveShadow={false}
        />
      </Environment>

      <CameraControls />
    </Canvas>
  )
}


/*
Author: Slava Z. (https://sketchfab.com/slava)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/3d-printable-radial-pneumatic-engine-3cbddbecd6c5462391e9936a3ccd7d32
Title: 3d Printable Radial Pneumatic Engine
*/
function Model(props) {
  // Fetch scroll data
  const scroll = useScroll()
  const { scene, animations } = useGLTF('/3d_printable_radial_pneumatic_engine-transformed.glb')
  const { actions } = useAnimations(animations, scene)
  useEffect(() => {
    // Enable shadows
    scene.traverse((o) => (o.castShadow = o.receiveShadow = true))
    // Start action, pause right away
    actions['Take 001'].play().paused = true
  }, [])
  useFrame((state, delta) => {
    const action = actions['Take 001']
    // Action.time is the clip duration multiplied with the normalized scroll offset (0-1)
    action.time = action.getClip().duration * scroll.offset
  })
  return <primitive object={scene} {...props} />
}
