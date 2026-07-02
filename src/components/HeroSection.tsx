"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Scene from "./Scene";
import OverlayType from "./OverlayType";
import { SCRUB_DURATION, BURST_TRIGGER, BURST } from "@/lib/phases";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface HeroTimelines {
  scrub: gsap.core.Timeline;
  burst: gsap.core.Timeline;
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [timelines, setTimelines] = useState<HeroTimelines | null>(null);

  useGSAP(
    () => {
      const burst = gsap.timeline({ paused: true });
      burst.set({}, {}, BURST.end);

      const scrub = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=350%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            if (self.progress >= BURST_TRIGGER) {
              if (burst.reversed() || (burst.paused() && burst.progress() < 1)) {
                burst.timeScale(1).play();
              }
            } else if (!burst.reversed() && burst.time() > 0) {
              burst.timeScale(1.6).reverse();
            }
          },
        },
      });
      scrub.set({}, {}, SCRUB_DURATION);

      setTimelines({ scrub, burst });
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
          <Scene timelines={timelines} />
        </Suspense>
      </Canvas>
      <OverlayType timelines={timelines} />
    </section>
  );
}
