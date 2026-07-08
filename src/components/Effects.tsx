"use client";

import {
  EffectComposer,
  DepthOfField,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

export default function Effects() {
  if (process.env.NEXT_PUBLIC_DEBUG_NO_FX === "1") return null;
  const noDof = process.env.NEXT_PUBLIC_DEBUG_NO_DOF === "1";
  return (
    <EffectComposer multisampling={4}>
      {noDof ? (
        <></>
      ) : (
        <DepthOfField
          worldFocusDistance={6}
          worldFocusRange={5}
          focalLength={0.02}
          bokehScale={2.5}
          height={700}
        />
      )}
      <Vignette offset={0.3} darkness={0.55} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.04} />
    </EffectComposer>
  );
}
