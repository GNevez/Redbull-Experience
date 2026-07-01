"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/balloons/scene.gltf");

const BALLOON_SCALE = 0.0011;

export interface BalloonsHandle {
  left: THREE.Group | null;
  right: THREE.Group | null;
}

function useSingleBalloon() {
  const { scene } = useGLTF("/balloons/scene.gltf");

  return useMemo(() => {
    let node: THREE.Object3D | null = null;
    scene.traverse((child) => {
      if (!node && child.name === "Balloon_low") {
        node = child;
      }
    });

    const container = new THREE.Group();
    if (node) {
      const clone = (node as THREE.Object3D).clone(true);
      clone.position.set(0, 0, 0);
      clone.rotation.set(0, 0, 0);
      clone.updateWorldMatrix(true, true);

      const box = new THREE.Box3().setFromObject(clone);
      const center = new THREE.Vector3();
      box.getCenter(center);
      clone.position.sub(center);

      container.add(clone);
    }
    return container;
  }, [scene]);
}

const Balloons = forwardRef<BalloonsHandle>(function Balloons(_props, ref) {
  const balloon = useSingleBalloon();
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);

  const leftBalloon = useMemo(() => balloon.clone(true), [balloon]);
  const rightBalloon = useMemo(() => balloon.clone(true), [balloon]);

  useImperativeHandle(ref, () => ({
    get left() {
      return leftRef.current;
    },
    get right() {
      return rightRef.current;
    },
  }));

  return (
    <group>
      <group
        ref={leftRef}
        position={[-7.5, 6, -22]}
        scale={BALLOON_SCALE}
        rotation={[0, 0.5, 0.04]}
      >
        <primitive object={leftBalloon} />
      </group>

      <group
        ref={rightRef}
        position={[8.5, 7.5, -28]}
        scale={BALLOON_SCALE * 0.8}
        rotation={[0, -0.5, -0.04]}
      >
        <primitive object={rightBalloon} />
      </group>
    </group>
  );
});

export default Balloons;
