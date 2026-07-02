"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

const CENTER_COLOR = new THREE.Color("#0d1b2e");
const EDGE_COLOR = new THREE.Color("#05080f");

function GradientDome() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      depthWrite: false,
      side: THREE.BackSide,
      uniforms: {
        centerColor: { value: CENTER_COLOR.clone() },
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
        uniform vec3 centerColor;
        uniform vec3 edgeColor;
        varying vec3 vWorldPosition;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec3 dir = normalize(vWorldPosition - cameraPosition);
          float facing = clamp(dot(dir, vec3(0.0, 0.0, -1.0)), 0.0, 1.0);
          float radial = pow(facing, 3.0);
          vec3 col = mix(edgeColor, centerColor, radial);
          col += (hash(gl_FragCoord.xy) - 0.5) * (2.0 / 255.0);
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

function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 0]}>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        color="#080c14"
        resolution={1024}
        blur={[400, 100]}
        mixBlur={0.9}
        mixStrength={2}
        roughness={0.7}
        mirror={0.5}
        depthScale={0.6}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.2}
      />
    </mesh>
  );
}

export default function Backdrop() {
  return (
    <group>
      <GradientDome />
      <ReflectiveFloor />
    </group>
  );
}
