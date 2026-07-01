"use client";

import { forwardRef } from "react";
import * as THREE from "three";
import { useCanParts } from "@/hooks/useCanModel";

const CAN_SCALE = 9;

const MainCan = forwardRef<THREE.Group>(function MainCan(_props, ref) {
  const { geometry, material } = useCanParts();

  return (
    <group ref={ref} scale={CAN_SCALE}>
      <mesh geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
});

export default MainCan;
