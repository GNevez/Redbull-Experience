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

    const dbg =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;

    if (material instanceof THREE.MeshPhysicalMaterial) {
      material.roughness = Math.max(material.roughness, 0.38);
      material.clearcoat = dbg?.has("nocc") ? 0 : 0.35;
      material.clearcoatRoughness = 0.32;
      material.envMapIntensity = dbg?.has("noenv") ? 0 : 0.8;
      material.normalScale.setScalar(dbg?.has("nonormal") ? 0 : 0.55);
      if (dbg?.has("nonormal")) material.normalMap = null;
    } else if (material instanceof THREE.MeshStandardMaterial) {
      material.roughness = Math.max(material.roughness, 0.38);
      material.envMapIntensity = 0.8;
      material.normalScale.setScalar(0.55);
    }

    return { geometry, material };
  }, [scene]);
}
