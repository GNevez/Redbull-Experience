"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Scene from "./Scene";
import OverlayType from "./OverlayType";
import { PHASES } from "@/lib/phases";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 1,
        },
      });
      tl.set({}, {}, PHASES.end);
      setTimeline(tl);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 40, near: 0.1, far: 100 }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor("#05080f", 1);
          scene.background = new THREE.Color("#05080f");
        }}
      >
        <Suspense fallback={null}>
          <Scene timeline={timeline} />
        </Suspense>
      </Canvas>
      <OverlayType timeline={timeline} />
    </section>
  );
}
