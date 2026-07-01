import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const CAN_URL = "/cans/scene.gltf";
const CENTER_CAN_NODE = "Object_4";

useGLTF.preload(CAN_URL);

export interface CanParts {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}

export function useCanParts(): CanParts {
  const { scene } = useGLTF(CAN_URL);

  return useMemo(() => {
    let source: THREE.Mesh | null = null;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === CENTER_CAN_NODE) {
        source = child;
      }
    });

    if (!source) {
      scene.traverse((child) => {
        if (!source && child instanceof THREE.Mesh) {
          source = child;
        }
      });
    }

    const mesh = source as unknown as THREE.Mesh;
    const geometry = mesh.geometry.clone();
    geometry.center();

    const material = (mesh.material as THREE.Material).clone();

    return { geometry, material };
  }, [scene]);
}
