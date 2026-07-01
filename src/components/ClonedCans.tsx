"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { useCanParts } from "@/hooks/useCanModel";

const CLONE_COUNT = 8;
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

const SCATTER: {
  x: number;
  y: number;
  z: number;
}[] = [
  { x: -3.0, y: 0.6, z: 1.4 },
  { x: 3.1, y: -0.2, z: 1.2 },
  { x: -3.4, y: -1.0, z: -0.8 },
  { x: 3.5, y: 1.1, z: -0.6 },
  { x: -2.6, y: 1.6, z: -2.6 },
  { x: 2.7, y: -1.6, z: -2.4 },
  { x: -3.8, y: -0.2, z: -3.6 },
  { x: 3.9, y: 0.3, z: -3.8 },
];

function computeTargets(count: number): CloneTarget[] {
  const targets: CloneTarget[] = [];

  for (let i = 0; i < count; i++) {
    const s = SCATTER[i % SCATTER.length];

    targets.push({
      position: new THREE.Vector3(s.x, s.y, s.z),
      rotation: new THREE.Euler(
        -Math.PI / 2 + (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * Math.PI * 1.4,
        (Math.random() - 0.5) * 0.5,
      ),
    });
  }

  return targets;
}

const ClonedCans = forwardRef<ClonedCansHandle>(function ClonedCans(
  _props,
  ref,
) {
  const { geometry, material } = useCanParts();
  const groupRef = useRef<THREE.Group>(null);
  const itemRefs = useRef<(THREE.Object3D | null)[]>([]);
  const targets = useMemo(() => computeTargets(CLONE_COUNT), []);

  useImperativeHandle(ref, () => ({
    get group() {
      return groupRef.current;
    },
    get items() {
      return itemRefs.current;
    },
    targets,
  }));

  return (
    <group ref={groupRef} visible={false}>
      <Instances geometry={geometry} material={material} limit={CLONE_COUNT}>
        {Array.from({ length: CLONE_COUNT }).map((_, i) => (
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
