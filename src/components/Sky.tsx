"use client";

import { forwardRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

const WHITE = new THREE.Color("#ffffff");
const SUN_BOTTOM = new THREE.Color("#ffd9a0");
const SUN_MID = new THREE.Color("#ff9d7a");
const SUN_TOP = new THREE.Color("#8b6bd9");

export interface SkyHandle {
  material: THREE.ShaderMaterial | null;
}

const GradientBackdrop = forwardRef<THREE.ShaderMaterial>(
  function GradientBackdrop(_props, ref) {
    const material = useMemo(() => {
      const m = new THREE.ShaderMaterial({
        depthWrite: false,
        depthTest: false,
        side: THREE.BackSide,
        uniforms: {
          bottomColor: { value: SUN_BOTTOM.clone() },
          midColor: { value: SUN_MID.clone() },
          topColor: { value: SUN_TOP.clone() },
          whiteColor: { value: WHITE.clone() },
          reveal: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 bottomColor;
          uniform vec3 midColor;
          uniform vec3 topColor;
          uniform vec3 whiteColor;
          uniform float reveal;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition).y;
            float t = clamp((h + 0.4) * 0.9, 0.0, 1.0);
            vec3 lower = mix(bottomColor, midColor, smoothstep(0.0, 0.5, t));
            vec3 sky = mix(lower, topColor, smoothstep(0.45, 1.0, t));
            gl_FragColor = vec4(mix(whiteColor, sky, reveal), 1.0);
          }
        `,
      });
      return m;
    }, []);

    if (ref && typeof ref !== "function") {
      (ref as React.MutableRefObject<THREE.ShaderMaterial>).current = material;
    } else if (typeof ref === "function") {
      ref(material);
    }

    return (
      <mesh material={material} renderOrder={-1} frustumCulled={false}>
        <sphereGeometry args={[60, 32, 15]} />
      </mesh>
    );
  },
);

interface DriftCloudProps {
  seed: number;
  bounds: [number, number, number];
  volume: number;
  opacity: number;
  color: string;
  position: [number, number, number];
  drift: number;
  range: number;
}

function DriftCloud({
  seed,
  bounds,
  volume,
  opacity,
  color,
  position,
  drift,
  range,
}: DriftCloudProps) {
  const ref = useRef<THREE.Group>(null);
  const baseX = position[0];

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.x = baseX + Math.sin(t * drift) * range;
    ref.current.position.y = position[1] + Math.cos(t * drift * 0.7) * range * 0.3;
  });

  return (
    <group ref={ref} position={position}>
      <Cloud
        seed={seed}
        bounds={bounds}
        volume={volume}
        smallestVolume={0.25}
        concentrate="outside"
        growth={3}
        speed={0.15}
        opacity={opacity}
        color={color}
      />
    </group>
  );
}

const Sky = forwardRef<SkyHandle>(function Sky(_props, ref) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const cloudsRef = useRef<THREE.Group>(null);

  if (ref && typeof ref !== "function") {
    (ref as React.MutableRefObject<SkyHandle>).current = {
      get material() {
        return materialRef.current;
      },
    };
  }

  return (
    <group>
      <GradientBackdrop ref={materialRef} />

      <group ref={cloudsRef}>
        <Clouds
          material={THREE.MeshLambertMaterial}
          limit={300}
          frustumCulled={false}
        >
          <DriftCloud
            seed={12}
            bounds={[8, 1.8, 2]}
            volume={4.5}
            opacity={0.7}
            color="#ffe4c4"
            position={[-11, 6.5, -28]}
            drift={0.05}
            range={2.4}
          />
          <DriftCloud
            seed={41}
            bounds={[7, 1.6, 2]}
            volume={4}
            opacity={0.62}
            color="#ffd0d8"
            position={[12, 8.5, -32]}
            drift={0.04}
            range={2.8}
          />
          <DriftCloud
            seed={7}
            bounds={[9, 1.8, 2]}
            volume={4.5}
            opacity={0.55}
            color="#e6d4ff"
            position={[2, -9, -30]}
            drift={0.035}
            range={3.2}
          />
          <DriftCloud
            seed={88}
            bounds={[6, 1.4, 2]}
            volume={3.2}
            opacity={0.5}
            color="#ffd9c0"
            position={[-6, -2, -36]}
            drift={0.06}
            range={2.0}
          />
        </Clouds>
      </group>
    </group>
  );
});

export default Sky;
