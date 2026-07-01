"use client";

import { EffectComposer, DepthOfField } from "@react-three/postprocessing";

export default function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <DepthOfField
        worldFocusDistance={6}
        worldFocusRange={6}
        focalLength={0.018}
        bokehScale={3.5}
        height={700}
      />
    </EffectComposer>
  );
}
