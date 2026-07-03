"use client";

import { Suspense, useRef } from "react";
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
      timelines.radical.fromTo(
        group.rotation,
        { z: 0.03 },
        { z: -0.03, duration: RADICAL.sweepDuration, ease: "none" },
        RADICAL.sweep,
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
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
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
