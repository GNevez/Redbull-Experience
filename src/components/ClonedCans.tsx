"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { useCanParts } from "@/hooks/useCanModel";

export const CLONE_SCALE = 9;

export interface CloneTarget {
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

export interface ClonedCansHandle {
  group: THREE.Group | null;
  items: (THREE.Object3D | null)[];
  targets: CloneTarget[];
}

const TARGETS: CloneTarget[] = [
  {
    position: new THREE.Vector3(-3.0, 0.55, 1.4),
    rotation: new THREE.Euler(-1.45, 0.5, -0.2),
  },
  {
    position: new THREE.Vector3(3.0, -0.25, 1.2),
    rotation: new THREE.Euler(-1.7, -0.6, 0.25),
  },
  {
    position: new THREE.Vector3(-3.5, -1.0, -0.8),
    rotation: new THREE.Euler(-1.35, 1.1, 0.1),
  },
  {
    position: new THREE.Vector3(3.5, 1.05, -0.6),
    rotation: new THREE.Euler(-1.8, -1.2, -0.15),
  },
  {
    position: new THREE.Vector3(-2.7, 1.55, -2.6),
    rotation: new THREE.Euler(-1.55, 1.9, 0.3),
  },
  {
    position: new THREE.Vector3(2.7, -1.55, -2.4),
    rotation: new THREE.Euler(-1.5, -2.0, -0.3),
  },
  {
    position: new THREE.Vector3(-3.9, -0.15, -3.6),
    rotation: new THREE.Euler(-1.65, 2.6, 0.05),
  },
  {
    position: new THREE.Vector3(3.9, 0.3, -3.8),
    rotation: new THREE.Euler(-1.4, -2.7, -0.05),
  },
];

export const CLONE_COUNT = TARGETS.length;

const ClonedCans = forwardRef<ClonedCansHandle>(function ClonedCans(
  _props,
  ref,
) {
  const { geometry, material } = useCanParts();
  const groupRef = useRef<THREE.Group>(null);
  const itemRefs = useRef<(THREE.Object3D | null)[]>([]);

  useImperativeHandle(ref, () => ({
    get group() {
      return groupRef.current;
    },
    get items() {
      return itemRefs.current;
    },
    targets: TARGETS,
  }));

  return (
    <group ref={groupRef} visible={false}>
      <Instances geometry={geometry} material={material} limit={CLONE_COUNT}>
        {TARGETS.map((_, i) => (
          <Instance
            key={i}
            ref={(el: THREE.Object3D | null) => {
              itemRefs.current[i] = el;
            }}
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.001}
          />
        ))}
      </Instances>
    </group>
  );
});

export default ClonedCans;
