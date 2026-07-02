"use client";

import { Environment, Lightformer } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} color="#dfe8ff" />

      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#f5ecdc" />

      <Environment resolution={256} background={false}>
        <Lightformer
          form="rect"
          intensity={4}
          color="#dce6f5"
          position={[-6, 1, 2]}
          rotation={[0, Math.PI / 2.6, 0]}
          scale={[1.5, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          color="#e8eef8"
          position={[6, 1, 2]}
          rotation={[0, -Math.PI / 2.6, 0]}
          scale={[1.5, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#ffffff"
          position={[0, 6, 3]}
          rotation={[-Math.PI / 2.4, 0, 0]}
          scale={[10, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#aebdd8"
          position={[0, -5, 4]}
          scale={[10, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.3}
          color="#ff2a2a"
          position={[-8, -1, -2]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[2, 6, 1]}
        />
      </Environment>
    </>
  );
}
