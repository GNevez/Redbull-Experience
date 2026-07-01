"use client";

import { forwardRef } from "react";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

const EmergenceCloud = forwardRef<THREE.Group>(function EmergenceCloud(
  _props,
  ref,
) {
  return (
    <group ref={ref}>
      <Clouds material={THREE.MeshBasicMaterial} frustumCulled={false}>
        <Cloud
          seed={3}
          bounds={[2.2, 1.6, 1.2]}
          volume={2.2}
          smallestVolume={0.18}
          concentrate="inside"
          growth={2}
          speed={0.3}
          opacity={0.55}
          color="#fff0dc"
          position={[0, -0.2, -1]}
        />
      </Clouds>
    </group>
  );
});

export default EmergenceCloud;
