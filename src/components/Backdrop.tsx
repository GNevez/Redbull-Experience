"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

const CENTER_COLOR = new THREE.Color("#123052");
const EDGE_COLOR = new THREE.Color("#04070d");
const FLOOR_NEAR = new THREE.Color("#09111d");
const FLOOR_MID = new THREE.Color("#162945");
const FLOOR_GLOW = new THREE.Color("#3f7fcb");
const FLOOR_RED = new THREE.Color("#4d111e");
const MIST_COLOR = new THREE.Color("#2f6fae");

function GradientDome() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      depthWrite: false,
      depthTest: false,
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
        color="#12223a"
        resolution={1024}
        blur={[650, 180]}
        mixBlur={1}
        mixStrength={1.45}
        roughness={0.78}
        mirror={0.34}
        depthScale={0.38}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.7}
      />
    </mesh>
  );
}

function FloorWash() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        nearColor: { value: FLOOR_NEAR.clone() },
        midColor: { value: FLOOR_MID.clone() },
        glowColor: { value: FLOOR_GLOW.clone() },
        redColor: { value: FLOOR_RED.clone() },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 nearColor;
        uniform vec3 midColor;
        uniform vec3 glowColor;
        uniform vec3 redColor;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(41.19, 289.77))) * 12578.1453);
        }

        void main() {
          vec2 p = vUv - 0.5;
          float depth = smoothstep(0.08, 0.92, vUv.y);
          float center = exp(-dot(p * vec2(2.0, 3.2), p * vec2(2.0, 3.2)) * 4.3);
          float horizon = smoothstep(0.48, 0.88, vUv.y) * (1.0 - smoothstep(0.92, 1.0, vUv.y));
          float sideRed = exp(-pow((vUv.x - 0.16) * 5.0, 2.0)) * smoothstep(0.2, 0.78, vUv.y);
          float grain = (hash(gl_FragCoord.xy) - 0.5) * 0.025;

          vec3 floorColor = mix(nearColor, midColor, depth);
          floorColor += glowColor * (center * 0.58 + horizon * 0.28);
          floorColor += redColor * sideRed * 0.32;
          floorColor += grain;

          float vignette = smoothstep(0.78, 0.14, length(p * vec2(1.0, 0.72)));
          float alpha = 0.78 * vignette + horizon * 0.22;
          gl_FragColor = vec4(floorColor, clamp(alpha, 0.0, 0.86));
        }
      `,
    });
  }, []);

  return (
    <mesh
      material={material}
      position={[0, -3.385, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={-1}
    >
      <planeGeometry args={[34, 30]} />
    </mesh>
  );
}

function HorizonMist() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        mistColor: { value: MIST_COLOR.clone() },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 mistColor;
        varying vec2 vUv;

        void main() {
          float vertical = smoothstep(0.0, 0.45, vUv.y) * (1.0 - smoothstep(0.78, 1.0, vUv.y));
          float horizontal = smoothstep(0.0, 0.22, vUv.x) * (1.0 - smoothstep(0.78, 1.0, vUv.x));
          float alpha = vertical * horizontal * 0.28;
          gl_FragColor = vec4(mistColor, alpha);
        }
      `,
    });
  }, []);

  return (
    <mesh material={material} position={[0, -2.72, -9.5]} renderOrder={-1}>
      <planeGeometry args={[44, 5.5]} />
    </mesh>
  );
}

export default function Backdrop() {
  return (
    <group>
      <GradientDome />
      <ReflectiveFloor />
      <FloorWash />
      <HorizonMist />
    </group>
  );
}
