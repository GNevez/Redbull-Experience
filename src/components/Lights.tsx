"use client";

import { Environment, Lightformer } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={1.05} color="#ffffff" />

      <directionalLight
        position={[3, 5, 6]}
        intensity={1.7}
        color="#fffaf2"
      />

      <directionalLight
        position={[-5, 2, 4]}
        intensity={1.3}
        color="#eef2ff"
      />

      <directionalLight
        position={[0, -2, 5]}
        intensity={0.9}
        color="#ffffff"
      />

      <Environment resolution={256} background={false}>
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#ffffff"
          position={[0, 4, 5]}
          scale={[16, 8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#f2f5ff"
          position={[-7, 1, 3]}
          scale={[8, 12, 1]}
          rotation={[0, Math.PI / 3, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#fff5ea"
          position={[7, 2, 3]}
          scale={[8, 12, 1]}
          rotation={[0, -Math.PI / 3, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#ffffff"
          position={[0, -4, 4]}
          scale={[12, 6, 1]}
        />
        <Lightformer
          form="ring"
          intensity={2.4}
          color="#ffffff"
          position={[0, 2, 7]}
          scale={[5, 5, 1]}
        />
      </Environment>
    </>
  );
}
