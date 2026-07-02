"use client";

import { forwardRef } from "react";
import * as THREE from "three";

const ShockRing = forwardRef<THREE.Mesh>(function ShockRing(_props, ref) {
  return (
    <mesh ref={ref} position={[0, 0.1, -1.2]} scale={0.2}>
      <ringGeometry args={[0.92, 1, 64]} />
      <meshBasicMaterial
        color="#c8d4e6"
        transparent
        opacity={0}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
});

export default ShockRing;
