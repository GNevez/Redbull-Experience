"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";

const POOL_COLOR = new THREE.Color("#4b86d4");

const FloorPool = forwardRef<THREE.Mesh>(function FloorPool(_props, ref) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        poolColor: { value: POOL_COLOR.clone() },
        strength: { value: 0.24 },
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
          vec2 p = (vUv - 0.5) * vec2(1.25, 0.86);
          float d = length(p);
          float core = exp(-d * d * 4.2);
          float shelf = pow(clamp(1.0 - d * 1.5, 0.0, 1.0), 2.0);
          float contact = exp(-d * d * 18.0);
          float alpha = (core * 0.45 + shelf * 0.32 + contact * 0.2) * strength;
          gl_FragColor = vec4(poolColor, alpha);
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
      <circleGeometry args={[9.5, 96]} />
    </mesh>
  );
});

export default FloorPool;
