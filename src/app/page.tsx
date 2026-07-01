"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import Scene from "@/components/Scene";

const SCROLL_HEIGHT_VH = 500;

export default function Home() {
  return (
    <main>
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <Canvas
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 6], fov: 40, near: 0.1, far: 100 }}
          style={{ background: "#f4f4f2" }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor("#f4f4f2", 1);
            scene.background = new THREE.Color("#f4f4f2");
          }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div
        style={{
          position: "relative",
          height: `${SCROLL_HEIGHT_VH}vh`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </main>
  );
}
