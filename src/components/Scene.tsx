"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

import Backdrop from "./Backdrop";
import RingAccent from "./RingAccent";
import Lights from "./Lights";
import MainCan from "./MainCan";
import ClonedCans, { ClonedCansHandle, CLONE_SCALE } from "./ClonedCans";
import Effects from "./Effects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CAN_SCALE = 9;

const START = { x: -3.2, y: -3.6, z: -6 };
const CENTER = { x: 0, y: 0, z: 0 };

export default function Scene() {
  const mainCanRef = useRef<THREE.Group>(null);
  const clonesRef = useRef<ClonedCansHandle>(null);

  useGSAP(
    () => {
      const mainCan = mainCanRef.current;
      const clones = clonesRef.current;
      if (!mainCan || !clones) return;

      mainCan.position.set(START.x, START.y, START.z);
      mainCan.rotation.set(0.5, -1.6, 0.35);
      mainCan.scale.setScalar(CAN_SCALE * 0.6);
      mainCan.visible = true;

      const cloneGroup = clones.group;
      const cloneItems = clones.items;
      const cloneTargets = clones.targets;
      if (cloneGroup) cloneGroup.visible = false;
      cloneItems.forEach((item) => {
        if (item) {
          item.position.set(0, 0, 0);
          item.scale.setScalar(0.001);
        }
      });

      const master = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      master.addLabel("start", 0);

      master.to(
        mainCan.position,
        { x: CENTER.x, duration: 2.0, ease: "power2.inOut" },
        "start",
      );
      master.to(
        mainCan.position,
        { y: 0.6, duration: 1.3, ease: "power2.out" },
        "start",
      );
      master.to(
        mainCan.position,
        { y: CENTER.y, duration: 0.9, ease: "power1.inOut" },
        "start+=1.3",
      );
      master.to(
        mainCan.position,
        { z: CENTER.z, duration: 2.0, ease: "power2.out" },
        "start",
      );

      master.to(
        mainCan.rotation,
        { y: Math.PI * 2 + 0.08, duration: 2.0, ease: "power2.out" },
        "start",
      );
      master.to(
        mainCan.rotation,
        { x: 0, duration: 1.8, ease: "power2.out" },
        "start",
      );
      master.to(
        mainCan.rotation,
        { z: 0, duration: 1.8, ease: "power2.out" },
        "start",
      );

      master.to(
        mainCan.scale,
        { x: CAN_SCALE, y: CAN_SCALE, z: CAN_SCALE, duration: 2.0, ease: "power2.out" },
        "start",
      );

      master.addLabel("impact", 2.15);

      master.to(
        mainCan.scale,
        { x: CAN_SCALE * 1.12, y: CAN_SCALE * 0.9, z: CAN_SCALE * 1.12, duration: 0.15, ease: "power2.out" },
        "impact",
      );
      master.to(
        mainCan.scale,
        { x: CAN_SCALE, y: CAN_SCALE, z: CAN_SCALE, duration: 0.55, ease: "elastic.out(1, 0.5)" },
        "impact+=0.15",
      );
      master.to(
        mainCan.position,
        { y: "-=0.12", duration: 0.15, ease: "power2.out" },
        "impact",
      );
      master.to(
        mainCan.position,
        { y: 0, duration: 0.55, ease: "elastic.out(1, 0.5)" },
        "impact+=0.15",
      );

      master.addLabel("burst", 2.7);

      master.set(cloneGroup, { visible: true }, "burst");
      master.set(mainCan, { visible: false }, "burst");
      master.set(mainCan.scale, { x: CAN_SCALE, y: CAN_SCALE, z: CAN_SCALE }, "burst");

      cloneItems.forEach((item, i) => {
        if (!item) return;
        const target = cloneTargets[i];
        const delay = (i % 4) * 0.05;

        master.fromTo(
          item.scale,
          { x: 0.001, y: 0.001, z: 0.001 },
          { x: CLONE_SCALE, y: CLONE_SCALE, z: CLONE_SCALE, duration: 0.7, ease: "back.out(1.3)" },
          `burst+=${delay}`,
        );
        master.fromTo(
          item.position,
          { x: 0, y: 0, z: 0 },
          {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z,
            duration: 1.8,
            ease: "power2.out",
          },
          `burst+=${delay}`,
        );
        master.fromTo(
          item.rotation,
          { x: -Math.PI / 2, y: 0, z: 0 },
          {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z,
            duration: 2.0,
            ease: "power1.out",
          },
          `burst+=${delay}`,
        );
      });

      master.addLabel("settle", 5.0);
    },
    { dependencies: [] },
  );

  return (
    <>
      <Backdrop />
      <RingAccent />
      <Lights />

      <MainCan ref={mainCanRef} />
      <ClonedCans ref={clonesRef} />

      <Effects />
    </>
  );
}
