"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Scene from "./Scene";
import OverlayType from "./OverlayType";
import LogoBadge from "./LogoBadge";
import CarOverlay from "./CarOverlay";
import SectionEnergy from "./SectionEnergy";
import SectionRoll from "./SectionRoll";
import SectionRadical from "./SectionRadical";
import LiquidOverlay from "./LiquidOverlay";
import {
  HERO_SCRUB_DURATION,
  BURST_TRIGGER,
  BURST,
  FALL_DURATION,
  ROLL_DURATION,
  RADICAL_DURATION,
  LIQUID_DURATION,
} from "@/lib/phases";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface ExperienceTimelines {
  heroScrub: gsap.core.Timeline;
  burst: gsap.core.Timeline;
  fall: gsap.core.Timeline;
  roll: gsap.core.Timeline;
  radical: gsap.core.Timeline;
  liquid: gsap.core.Timeline;
}

export default function Experience() {
  const heroRef = useRef<HTMLElement>(null);
  const energyRef = useRef<HTMLElement>(null);
  const rollRef = useRef<HTMLElement>(null);
  const radicalRef = useRef<HTMLElement>(null);
  const diveRef = useRef<HTMLElement>(null);
  const [timelines, setTimelines] = useState<ExperienceTimelines | null>(null);

  useGSAP(() => {
    const burst = gsap.timeline({ paused: true });
    burst.set({}, {}, BURST.end);

    const heroScrub = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom bottom",
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
    heroScrub.set({}, {}, HERO_SCRUB_DURATION);

    burst.eventCallback("onReverseComplete", () => {
      const p = heroScrub.progress();
      heroScrub.progress(Math.min(1, p + 0.001)).progress(p);
    });

    const fall = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: energyRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
        onEnter: () => {
          if (burst.progress() < 1) {
            burst.progress(1);
            fall.invalidate();
          }
        },
      },
    });
    fall.set({}, {}, FALL_DURATION);

    const roll = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: rollRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    roll.set({}, {}, ROLL_DURATION);

    const radical = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: radicalRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    radical.set({}, {}, RADICAL_DURATION);

    const liquid = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: diveRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    liquid.set({}, {}, LIQUID_DURATION);

    setTimelines({ heroScrub, burst, fall, roll, radical, liquid });
  });

  return (
    <main>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
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
      </div>

      <LogoBadge />

      <section
        ref={heroRef}
        style={{ position: "relative", height: "500vh", zIndex: 1 }}
      >
        <div style={{ position: "sticky", top: 0, height: "100vh" }}>
          <OverlayType timelines={timelines} />
        </div>
      </section>

      <SectionEnergy ref={energyRef} timelines={timelines} />
      <SectionRoll ref={rollRef} timelines={timelines} />
      <SectionRadical ref={radicalRef} timelines={timelines} />
      <section
        ref={diveRef}
        style={{
          position: "relative",
          height: "450vh",
          zIndex: 1,
          background: "linear-gradient(180deg, #ece1cf 0%, #f4ede0 100%)",
        }}
      />

      <LiquidOverlay timelines={timelines} />
      <CarOverlay timelines={timelines} />
    </main>
  );
}
