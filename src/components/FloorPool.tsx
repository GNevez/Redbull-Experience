"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";

const POOL_COLOR = new THREE.Color("#33568c");

const FloorPool = forwardRef<THREE.Mesh>(function FloorPool(_props, ref) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        poolColor: { value: POOL_COLOR.clone() },
        strength: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 poolColor;
        uniform float strength;
        varying vec2 vUv;
        void main() {
          float d = distance(vUv, vec2(0.5));
          float falloff = pow(clamp(1.0 - d * 2.0, 0.0, 1.0), 2.0);
          gl_FragColor = vec4(poolColor, falloff * strength);
        }
      `,
    });
  }, []);

  return (
    <mesh
      ref={ref}
      material={material}
      position={[0, -3.39, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[8, 64]} />
    </mesh>
  );
});

export default FloorPool;
