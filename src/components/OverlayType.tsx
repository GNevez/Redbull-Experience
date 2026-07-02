"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { PHASES } from "@/lib/phases";

gsap.registerPlugin(useGSAP, SplitText);

interface OverlayTypeProps {
  timeline: gsap.core.Timeline | null;
}

export default function OverlayType({ timeline }: OverlayTypeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const letteringRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const logo = logoRef.current;
      const lettering = letteringRef.current;
      if (!timeline || !logo || !lettering) return;

      const split = SplitText.create(lettering, {
        type: "chars",
        mask: "chars",
      });
      gsap.set(lettering, { visibility: "visible" });

      timeline.fromTo(
        logo,
        { opacity: 0, scale: 0.85, filter: "blur(12px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
        },
        PHASES.reveal,
      );
      timeline.fromTo(
        split.chars,
        { yPercent: 120 },
        { yPercent: 0, duration: 0.6, stagger: 0.035, ease: "power4.out" },
        PHASES.reveal + 0.4,
      );

      return () => {
        split.revert();
      };
    },
    { scope: rootRef, dependencies: [timeline] },
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
          lineHeight: 1.05,
          textAlign: "center",
          color: "#f4f4f6",
          textShadow: "0 0 32px rgba(160, 190, 255, 0.18)",
          visibility: "hidden",
        }}
      >
        Red Bull te dá asas.
      </h1>
    </div>
  );
}
