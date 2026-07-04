"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import { RADICAL } from "@/lib/phases";
import type { ExperienceTimelines } from "./Experience";

gsap.registerPlugin(useGSAP);

const CAR_URL = "/car/scene.gltf";

useGLTF.preload(CAR_URL);

interface CarOverlayProps {
  timelines: ExperienceTimelines | null;
}

function CarShadow() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        strength: { value: 0.4 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float strength;
        varying vec2 vUv;
        void main() {
          vec2 p = (vUv - 0.5) * vec2(1.0, 2.4);
          float falloff = exp(-dot(p, p) * 7.0);
          gl_FragColor = vec4(0.0, 0.0, 0.0, falloff * strength);
        }
      `,
    });
  }, []);

  return (
    <mesh
      material={material}
      position={[0, -38, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[150, 48]} />
    </mesh>
  );
}

function CarRig({ timelines }: CarOverlayProps) {
  const { scene } = useGLTF(CAR_URL);
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(
    () => {
      const group = groupRef.current;
      if (!timelines || !group) return;

      timelines.radical.fromTo(
        group.position,
        { x: -11 },
        { x: 11, duration: RADICAL.sweepDuration, ease: "power1.inOut" },
        RADICAL.sweep,
      );
      timelines.radical.to(
        group.position,
        {
          keyframes: [
            { y: -0.52, duration: 0.16 },
            { y: -0.57, duration: 0.14 },
            { y: -0.53, duration: 0.15 },
            { y: -0.57, duration: 0.16 },
            { y: -0.55, duration: 0.14 },
          ],
        },
        RADICAL.sweep + 0.2,
      );
      timelines.radical.fromTo(
        group.rotation,
        { z: 0.03 },
        { z: -0.03, duration: RADICAL.sweepDuration, ease: "none" },
        RADICAL.sweep,
      );
      timelines.radical.to(
        group.scale,
        {
          keyframes: [
            { x: 0.0215, duration: 0.45, ease: "power1.in" },
            { x: 0.02, duration: 0.5, ease: "power1.out" },
          ],
        },
        RADICAL.sweep + 0.15,
      );
    },
    { dependencies: [timelines] },
  );

  return (
    <group
      ref={groupRef}
      position={[-11, -0.55, 1.5]}
      rotation={[0, Math.PI / 2, 0]}
      scale={0.02}
    >
      <primitive object={scene} />
      <CarShadow />
    </group>
  );
}

export default function CarOverlay({ timelines }: CarOverlayProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 40, near: 0.1, far: 100 }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.domElement.style.pointerEvents = "none";
        }}
      >
        <ambientLight intensity={1.1} color="#ffffff" />
        <directionalLight position={[4, 6, 8]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[-6, 2, 5]} intensity={1.4} color="#dfe8ff" />
        <Suspense fallback={null}>
          <CarRig timelines={timelines} />
        </Suspense>
      </Canvas>
    </div>
  );
}
