"use client";

import { forwardRef, useEffect, useMemo } from "react";
import * as THREE from "three";

function makeCloudTexture(): THREE.Texture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const cx = size / 2;
  const cy = size / 2;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.75, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const Cloud = forwardRef<THREE.Mesh>(function Cloud(_props, ref) {
  const texture = useMemo(
    () => (typeof document !== "undefined" ? makeCloudTexture() : null),
    [],
  );

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return (
    <mesh ref={ref} position={[0, 0, 1.2]} scale={[6, 6, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture ?? undefined}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
});

export default Cloud;
