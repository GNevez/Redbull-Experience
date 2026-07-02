"use client";

import {
  EffectComposer,
  DepthOfField,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <DepthOfField
        worldFocusDistance={6}
        worldFocusRange={5}
        focalLength={0.02}
        bokehScale={2.5}
        height={700}
      />
      <Vignette offset={0.3} darkness={0.55} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.04} />
    </EffectComposer>
  );
}
