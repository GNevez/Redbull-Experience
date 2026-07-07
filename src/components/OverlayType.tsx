"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { BURST } from "@/lib/phases";
import type { ExperienceTimelines } from "./Experience";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface OverlayTypeProps {
  timelines: ExperienceTimelines | null;
}

export default function OverlayType({ timelines }: OverlayTypeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const letteringRef = useRef<HTMLHeadingElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const logo = logoRef.current;
      const lettering = letteringRef.current;
      const hint = hintRef.current;
      if (!timelines || !logo || !lettering || !hint) return;

      const { heroScrub: scrub, burst } = timelines;

      const split = SplitText.create(lettering, {
        type: "chars",
        mask: "chars",
      });
      gsap.set(lettering, { visibility: "visible" });

      scrub.fromTo(
        hint,
        { opacity: 1 },
        { opacity: 0, duration: 0.5, ease: "none" },
        0.25,
      );

      burst.fromTo(
        logo,
        { opacity: 0, scale: 0.85, filter: "blur(14px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
        BURST.logo,
      );
      burst.fromTo(
        split.chars,
        { yPercent: 120 },
        { yPercent: 0, duration: 0.55, stagger: 0.03, ease: "power4.out" },
        BURST.lettering,
      );

      ScrollTrigger.refresh();

      return () => {
        split.revert();
      };
    },
    { scope: rootRef, dependencies: [timelines] },
  );

  return (
    <div
      ref={rootRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.5rem",
      }}
    >
      <div style={{ filter: "drop-shadow(0 0 28px rgba(170, 200, 255, 0.22))" }}>
        <img
          ref={logoRef}
          src="/redbull-logo.svg"
          alt="Red Bull"
          style={{
            width: "clamp(180px, 26vw, 380px)",
            display: "block",
            opacity: 0,
          }}
        />
      </div>
      <h1
        ref={letteringRef}
        style={{
          fontFamily: "var(--font-display), sans-serif",
          fontWeight: 400,
          textTransform: "uppercase",
          fontSize: "clamp(2.5rem, 8vw, 7rem)",
          letterSpacing: "-0.01em",
          lineHeight: 1.22,
          textAlign: "center",
          color: "#f4f4f6",
          filter: "drop-shadow(0 0 26px rgba(160, 190, 255, 0.28))",
          visibility: "hidden",
        }}
      >
        Red Bull te dá asas.
      </h1>
      <p
        ref={hintRef}
        style={{
          position: "absolute",
          bottom: "3rem",
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#8fa3c4",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          fontSize: "0.8rem",
        }}
      >
        role para revelar
      </p>
    </div>
  );
}
