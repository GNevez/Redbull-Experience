"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Backdrop from "./Backdrop";
import Lights from "./Lights";
import MainCan from "./MainCan";
import ShockRing from "./ShockRing";
import ClonedCans, { ClonedCansHandle, CLONE_SCALE } from "./ClonedCans";
import Effects from "./Effects";
import { PHASES } from "@/lib/phases";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CAN_SCALE = 9;
const START = { x: -3.2, y: -3.6, z: -6 };

interface SceneProps {
  timeline: gsap.core.Timeline | null;
}

export default function Scene({ timeline }: SceneProps) {
  const mainCanRef = useRef<THREE.Group>(null);
  const clonesRef = useRef<ClonedCansHandle>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const camera = useThree((state) => state.camera);

  useGSAP(
    () => {
      const mainCan = mainCanRef.current;
      const clones = clonesRef.current;
      const ring = ringRef.current;
      if (!timeline || !mainCan || !clones || !ring) return;

      const cloneGroup = clones.group;
      const cloneItems = clones.items;
      const targets = clones.targets;
      const ringMaterial = ring.material as THREE.MeshBasicMaterial;

      timeline.set(mainCan, { visible: true }, 0);
      if (cloneGroup) timeline.set(cloneGroup, { visible: false }, 0);

      timeline.fromTo(
        mainCan.position,
        { x: START.x },
        { x: 0, duration: 2.0, ease: "power2.inOut" },
        0,
      );
      timeline.fromTo(
        mainCan.position,
        { y: START.y },
        { y: 0.6, duration: 1.3, ease: "power2.out" },
        0,
      );
      timeline.to(
        mainCan.position,
        { y: 0, duration: 0.85, ease: "power1.inOut" },
        1.3,
      );
      timeline.fromTo(
        mainCan.position,
        { z: START.z },
        { z: 0, duration: 2.0, ease: "power2.out" },
        0,
      );

      timeline.fromTo(
        mainCan.rotation,
        { y: -1.6 },
        { y: Math.PI * 2 + 0.08, duration: 2.0, ease: "power2.out" },
        0,
      );
      timeline.fromTo(
        mainCan.rotation,
        { x: 0.5 },
        { x: 0, duration: 1.8, ease: "power2.out" },
        0,
      );
      timeline.fromTo(
        mainCan.rotation,
        { z: 0.35 },
        { z: 0, duration: 1.8, ease: "power2.out" },
        0,
      );

      timeline.fromTo(
        mainCan.scale,
        { x: CAN_SCALE * 0.6, y: CAN_SCALE * 0.6, z: CAN_SCALE * 0.6 },
        { x: CAN_SCALE, y: CAN_SCALE, z: CAN_SCALE, duration: 2.0, ease: "power2.out" },
        0,
      );

      timeline.to(
        mainCan.scale,
        {
          x: CAN_SCALE * 1.12,
          y: CAN_SCALE * 0.9,
          z: CAN_SCALE * 1.12,
          duration: 0.15,
          ease: "power2.out",
        },
        PHASES.impact,
      );
      timeline.to(
        mainCan.scale,
        {
          x: CAN_SCALE,
          y: CAN_SCALE,
          z: CAN_SCALE,
          duration: 0.55,
          ease: "elastic.out(1, 0.5)",
        },
        PHASES.impact + 0.15,
      );
      timeline.to(
        mainCan.position,
        { y: -0.12, duration: 0.15, ease: "power2.out" },
        PHASES.impact,
      );
      timeline.to(
        mainCan.position,
        { y: 0, duration: 0.55, ease: "elastic.out(1, 0.5)" },
        PHASES.impact + 0.15,
      );

      timeline.to(
        camera.position,
        {
          keyframes: [
            { x: 0.06, y: -0.04, duration: 0.05 },
            { x: -0.05, y: 0.03, duration: 0.05 },
            { x: 0.03, y: -0.02, duration: 0.05 },
            { x: 0, y: 0, duration: 0.05 },
          ],
        },
        PHASES.impact,
      );

      timeline.fromTo(
        ring.scale,
        { x: 0.2, y: 0.2, z: 0.2 },
        { x: 6, y: 6, z: 6, duration: 0.8, ease: "power3.out" },
        PHASES.impact,
      );
      timeline.to(
        ringMaterial,
        {
          keyframes: [
            { opacity: 0.5, duration: 0.08 },
            { opacity: 0, duration: 0.72, ease: "power2.out" },
          ],
        },
        PHASES.impact,
      );

      if (cloneGroup) timeline.set(cloneGroup, { visible: true }, PHASES.burst);
      timeline.set(mainCan, { visible: false }, PHASES.burst);

      cloneItems.forEach((item, i) => {
        if (!item) return;
        const target = targets[i];
        const delay = i * 0.05;

        timeline.set(
          item.scale,
          { x: CLONE_SCALE, y: CLONE_SCALE, z: CLONE_SCALE },
          PHASES.burst,
        );
        timeline.fromTo(
          item.position,
          { x: 0, y: 0, z: 0 },
          {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z,
            duration: 1.8,
            ease: "power2.out",
          },
          PHASES.burst + delay,
        );
        timeline.fromTo(
          item.rotation,
          { x: -Math.PI / 2, y: 0, z: 0 },
          {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z,
            duration: 2.0,
            ease: "power1.out",
          },
          PHASES.burst + delay,
        );
        timeline.to(
          item.scale,
          {
            x: CLONE_SCALE * 1.06,
            y: CLONE_SCALE * 1.06,
            z: CLONE_SCALE * 1.06,
            duration: 0.15,
            ease: "power2.in",
          },
          PHASES.burst + delay + 1.5,
        );
        timeline.to(
          item.scale,
          {
            x: CLONE_SCALE,
            y: CLONE_SCALE,
            z: CLONE_SCALE,
            duration: 0.4,
            ease: "elastic.out(1, 0.5)",
          },
          PHASES.burst + delay + 1.65,
        );
      });

      ScrollTrigger.refresh();
    },
    { dependencies: [timeline] },
  );

  useFrame((state) => {
    const clones = clonesRef.current;
    if (!timeline || !clones) return;
    const t = timeline.time();
    clones.items.forEach((item, i) => {
      if (!item) return;
      const release = PHASES.burst + i * 0.05 + 1.8;
      if (t > release) {
        const target = clones.targets[i];
        item.position.y =
          target.position.y +
          Math.sin(state.clock.elapsedTime * (0.8 + i * 0.13) + i * 1.7) * 0.05;
      }
    });
  });

  return (
    <>
      <Backdrop />
      <Lights />
      <MainCan ref={mainCanRef} />
      <ClonedCans ref={clonesRef} />
      <ShockRing ref={ringRef} />
      <Effects />
    </>
  );
}
