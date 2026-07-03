"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import Backdrop from "./Backdrop";
import Lights from "./Lights";
import MainCan from "./MainCan";
import ShockRing from "./ShockRing";
import ClonedCans, { ClonedCansHandle, CLONE_SCALE } from "./ClonedCans";
import Effects from "./Effects";
import { BURST, FALL, ROLL, HERO_CLONE_INDEX } from "@/lib/phases";
import type { ExperienceTimelines } from "./Experience";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CAN_SCALE = 9;
const FALL_OFFSETS = [0, 0, 0.15, 0.3, 0.05, 0.25, 0.1, 0.2];

interface SceneProps {
  timelines: ExperienceTimelines | null;
}

export default function Scene({ timelines }: SceneProps) {
  const mainCanRef = useRef<THREE.Group>(null);
  const clonesRef = useRef<ClonedCansHandle>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const flashRef = useRef<THREE.PointLight>(null);
  const camera = useThree((state) => state.camera);

  useGSAP(
    () => {
      const mainCan = mainCanRef.current;
      const clones = clonesRef.current;
      const ring = ringRef.current;
      const keyLight = keyLightRef.current;
      const fill = fillLightRef.current;
      const spot = spotRef.current;
      const flash = flashRef.current;
      if (
        !timelines ||
        !mainCan ||
        !clones ||
        !ring ||
        !keyLight ||
        !fill ||
        !spot ||
        !flash
      )
        return;

      const { heroScrub, burst, fall, roll } = timelines;
      const cloneGroup = clones.group;
      const cloneItems = clones.items;
      const targets = clones.targets;
      const ringMaterial = ring.material as THREE.MeshBasicMaterial;

      heroScrub.set(mainCan, { visible: true }, 0);
      if (cloneGroup) heroScrub.set(cloneGroup, { visible: false }, 0);

      heroScrub.fromTo(
        camera.position,
        { z: 7.3 },
        { z: 6, duration: 4, ease: "power1.out" },
        0,
      );

      heroScrub.fromTo(
        mainCan.position,
        { y: 5.2 },
        { y: 0.12, duration: 2.1, ease: "power1.inOut" },
        0.2,
      );
      heroScrub.fromTo(
        mainCan.rotation,
        { y: -3.6 },
        { y: 0.08, duration: 2.3, ease: "power1.out" },
        0,
      );
      heroScrub.fromTo(
        mainCan.rotation,
        { x: 0.35 },
        { x: 0, duration: 2.1, ease: "power1.out" },
        0.2,
      );
      heroScrub.fromTo(
        mainCan.rotation,
        { z: -0.1 },
        { z: 0, duration: 2.1, ease: "power1.out" },
        0.2,
      );
      heroScrub.fromTo(
        mainCan.scale,
        { x: CAN_SCALE * 0.92, y: CAN_SCALE * 0.92, z: CAN_SCALE * 0.92 },
        {
          x: CAN_SCALE,
          y: CAN_SCALE,
          z: CAN_SCALE,
          duration: 2.3,
          ease: "power1.out",
        },
        0,
      );

      heroScrub.fromTo(
        spot,
        { intensity: 0 },
        { intensity: 260, duration: 3, ease: "power2.inOut" },
        0.4,
      );
      heroScrub.fromTo(
        keyLight,
        { intensity: 0 },
        { intensity: 3.0, duration: 2.6, ease: "power2.inOut" },
        0.9,
      );
      heroScrub.fromTo(
        fill,
        { intensity: 0 },
        { intensity: 1.0, duration: 1.2, ease: "power2.inOut" },
        2.2,
      );

      burst.fromTo(
        mainCan.position,
        { y: 0.12 },
        { y: -0.16, duration: 0.3, ease: "power2.in", immediateRender: false },
        0,
      );
      burst.fromTo(
        mainCan.scale,
        { x: CAN_SCALE, y: CAN_SCALE, z: CAN_SCALE },
        {
          x: CAN_SCALE * 1.03,
          y: CAN_SCALE * 0.94,
          z: CAN_SCALE * 1.03,
          duration: 0.3,
          ease: "power2.in",
          immediateRender: false,
        },
        0,
      );

      burst.to(
        mainCan.position,
        { y: 0.05, duration: 0.12, ease: "power3.out" },
        BURST.impact,
      );
      burst.to(
        mainCan.scale,
        {
          x: CAN_SCALE * 1.16,
          y: CAN_SCALE * 0.84,
          z: CAN_SCALE * 1.16,
          duration: 0.11,
          ease: "power2.out",
        },
        BURST.impact,
      );
      burst.to(
        mainCan.scale,
        {
          x: CAN_SCALE,
          y: CAN_SCALE,
          z: CAN_SCALE,
          duration: 0.5,
          ease: "elastic.out(1, 0.55)",
        },
        BURST.impact + 0.11,
      );

      burst.to(
        camera.position,
        {
          keyframes: [
            { x: 0.07, y: -0.05, duration: 0.05 },
            { x: -0.06, y: 0.04, duration: 0.05 },
            { x: 0.035, y: -0.02, duration: 0.05 },
            { x: 0, y: 0, duration: 0.05 },
          ],
        },
        BURST.impact,
      );

      burst.fromTo(
        ring.scale,
        { x: 0.2, y: 0.2, z: 0.2 },
        { x: 7, y: 7, z: 7, duration: 0.9, ease: "expo.out" },
        BURST.impact,
      );
      burst.to(
        ringMaterial,
        {
          keyframes: [
            { opacity: 0.55, duration: 0.08 },
            { opacity: 0, duration: 0.82, ease: "power2.out" },
          ],
        },
        BURST.impact,
      );
      burst.to(
        flash,
        {
          keyframes: [
            { intensity: 90, duration: 0.07, ease: "power1.in" },
            { intensity: 0, duration: 0.45, ease: "power2.out" },
          ],
        },
        BURST.impact,
      );

      if (cloneGroup) burst.set(cloneGroup, { visible: true }, BURST.swap);
      burst.set(mainCan, { visible: false }, BURST.swap);

      cloneItems.forEach((item, i) => {
        if (!item) return;
        const target = targets[i];
        const delay = i * 0.04;

        burst.set(
          item.scale,
          { x: CLONE_SCALE, y: CLONE_SCALE, z: CLONE_SCALE },
          BURST.swap,
        );
        burst.fromTo(
          item.position,
          { x: 0, y: 0, z: 0 },
          {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z,
            duration: 1.15,
            ease: "expo.out",
          },
          BURST.swap + delay,
        );
        burst.fromTo(
          item.rotation,
          { x: -Math.PI / 2, y: 0, z: 0 },
          {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z,
            duration: 1.6,
            ease: "power2.out",
          },
          BURST.swap + delay,
        );
        burst.to(
          item.scale,
          {
            x: CLONE_SCALE * 1.05,
            y: CLONE_SCALE * 1.05,
            z: CLONE_SCALE * 1.05,
            duration: 0.12,
            ease: "power2.in",
          },
          BURST.swap + delay + 1.0,
        );
        burst.to(
          item.scale,
          {
            x: CLONE_SCALE,
            y: CLONE_SCALE,
            z: CLONE_SCALE,
            duration: 0.45,
            ease: "elastic.out(1, 0.5)",
          },
          BURST.swap + delay + 1.12,
        );
      });

      cloneItems.forEach((item, i) => {
        if (!item) return;
        const target = targets[i];

        if (i === HERO_CLONE_INDEX) {
          fall.to(
            item.position,
            { y: -1.35, duration: 1.1, ease: "power1.in" },
            FALL.park,
          );
          fall.to(
            item.position,
            { y: -0.1, duration: 1.3, ease: "power2.out" },
            FALL.park + 1.1,
          );
          fall.to(
            item.position,
            { x: 2.9, z: 0.2, duration: 2.4, ease: "power2.inOut" },
            FALL.park,
          );
          fall.to(
            item.rotation,
            { x: -Math.PI / 2, y: 0, z: -0.08, duration: 2.4, ease: "power2.inOut" },
            FALL.park,
          );
          return;
        }

        const offset = FALL_OFFSETS[i];
        fall.to(
          item.position,
          {
            x: target.position.x * 1.15,
            y: target.position.y - 15,
            z: target.position.z,
            duration: 1.7,
            ease: "power1.in",
          },
          FALL.drop + offset,
        );
        fall.to(
          item.rotation,
          {
            x: target.rotation.x + 2.2,
            z: target.rotation.z + 1.6,
            duration: 1.7,
            ease: "power1.in",
          },
          FALL.drop + offset,
        );
      });

      fall.to(
        fill,
        { intensity: 1.3, duration: 1.4, ease: "power2.inOut" },
        1.2,
      );
      fall.to(
        spot.position,
        { x: 2.3, duration: 1.6, ease: "power2.inOut" },
        0.9,
      );
      fall.to(
        spot,
        { intensity: 330, duration: 1.6, ease: "power2.inOut" },
        0.9,
      );

      const heroItem = cloneItems[HERO_CLONE_INDEX];
      if (heroItem) {
        timelines.radical.to(
          heroItem.position,
          { y: -8, duration: 0.9, ease: "power2.in" },
          0.05,
        );
        timelines.radical.set(
          heroItem.scale,
          { x: 0.001, y: 0.001, z: 0.001 },
          0.75,
        );
        roll.set(heroItem.rotation, { order: "ZXY" }, 0);
        roll.to(
          heroItem.rotation,
          { z: -0.28, duration: 0.4, ease: "power2.inOut" },
          0,
        );
        roll.to(
          heroItem.position,
          { x: -2.4, duration: 2.75, ease: "power1.inOut" },
          ROLL.travel,
        );
        roll.to(
          heroItem.rotation,
          { z: Math.PI * 2.2, duration: 2.75, ease: "power1.inOut" },
          ROLL.travel,
        );
        roll.to(
          spot.position,
          { x: -1.8, duration: 2.75, ease: "power1.inOut" },
          ROLL.travel,
        );
        roll.to(
          heroItem.position,
          { y: -0.25, duration: 0.5, ease: "power2.out" },
          ROLL.settle,
        );
        roll.to(
          heroItem.rotation,
          { z: Math.PI * 2.2 - 0.2, duration: 0.5, ease: "power2.out" },
          ROLL.settle,
        );
      }

      ScrollTrigger.refresh();
    },
    { dependencies: [timelines] },
  );

  useFrame((state) => {
    const clones = clonesRef.current;
    if (!timelines || !clones) return;
    const { burst, fall } = timelines;
    if (burst.reversed() || fall.time() > 0.03) return;
    const t = burst.time();
    clones.items.forEach((item, i) => {
      if (!item) return;
      const release = BURST.swap + i * 0.04 + 1.15;
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
      <directionalLight
        ref={keyLightRef}
        position={[3, 5, 7]}
        intensity={0}
        color="#f5ecdc"
      />
      <directionalLight
        ref={fillLightRef}
        position={[0, 1, 8]}
        intensity={0}
        color="#dfe8ff"
      />
      <spotLight
        ref={spotRef}
        position={[0, 9, 2.5]}
        angle={0.45}
        penumbra={0.9}
        intensity={0}
        distance={30}
        decay={1.2}
        color="#dfe8ff"
      />
      <pointLight
        ref={flashRef}
        position={[0, 0.6, 2.2]}
        intensity={0}
        distance={12}
        decay={2}
        color="#cfe0ff"
      />
      <Sparkles
        count={80}
        scale={[14, 9, 8]}
        size={1.4}
        speed={0.25}
        opacity={0.3}
        color="#9db8e8"
        position={[0, 0.4, -1]}
      />
      <MainCan ref={mainCanRef} />
      <ClonedCans ref={clonesRef} />
      <ShockRing ref={ringRef} />
      <Effects />
    </>
  );
}
