"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RingAccent() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.z += delta * 0.04;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z -= delta * 0.07;
    }
  });

  return (
    <group position={[0, 0, -4]}>
      <mesh ref={outerRef} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[4.6, 0.012, 16, 160]} />
        <meshBasicMaterial color="#c9c9c4" transparent opacity={0.5} toneMapped={false} />
      </mesh>

      <group ref={innerRef} rotation={[Math.PI / 2.6, 0, 0]}>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[3.4, 0.008, 16, 128, Math.PI * 1.35]} />
          <meshBasicMaterial color="#b8c4d8" transparent opacity={0.45} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
