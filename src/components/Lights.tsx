"use client";

import { Environment, Lightformer } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.24} color="#dfe8ff" />
      <hemisphereLight args={["#7faee7", "#14233a", 0.32]} />

      <Environment resolution={256} background={false}>
        <Lightformer
          form="rect"
          intensity={0.5}
          color="#31486b"
          scale={[100, 100, 1]}
          position={[0, 0, -14]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#dce6f5"
          position={[-6, 1, 2]}
          rotation={[0, Math.PI / 2.6, 0]}
          scale={[4, 12, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#e8eef8"
          position={[6, 1, 2]}
          rotation={[0, -Math.PI / 2.6, 0]}
          scale={[4, 12, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#ffffff"
          position={[0, 6, 3]}
          rotation={[-Math.PI / 2.4, 0, 0]}
          scale={[14, 7, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#aebdd8"
          position={[0, -5, 4]}
          scale={[14, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.25}
          color="#ff2a2a"
          position={[-8, -1, -2]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[3, 7, 1]}
        />
      </Environment>
    </>
  );
}
