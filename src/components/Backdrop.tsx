"use client";

import { useMemo } from "react";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const BASE_COLOR = new THREE.Color("#f4f4f2");
const HALO_COLOR = new THREE.Color("#ffffff");
const EDGE_COLOR = new THREE.Color("#e4e4e0");

function RadialHalo() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      depthWrite: false,
      depthTest: false,
      side: THREE.BackSide,
      uniforms: {
        haloColor: { value: HALO_COLOR.clone() },
        baseColor: { value: BASE_COLOR.clone() },
        edgeColor: { value: EDGE_COLOR.clone() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPosition;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPosition = wp.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 haloColor;
        uniform vec3 baseColor;
        uniform vec3 edgeColor;
        varying vec3 vWorldPosition;
        void main() {
          vec3 dir = normalize(vWorldPosition);
          float radial = clamp(1.0 - length(dir.xy) * 1.15, 0.0, 1.0);
          float halo = pow(radial, 2.2);
          vec3 col = mix(edgeColor, baseColor, smoothstep(0.0, 0.55, radial));
          col = mix(col, haloColor, halo * 0.85);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh material={material} renderOrder={-2} frustumCulled={false}>
      <sphereGeometry args={[50, 32, 16]} />
    </mesh>
  );
}

export default function Backdrop() {
  return (
    <group>
      <RadialHalo />

      <ContactShadows
        position={[0, -3.4, 0]}
        scale={16}
        resolution={1024}
        blur={3.2}
        opacity={0.32}
        far={9}
        color="#8a8a86"
      />
    </group>
  );
}
