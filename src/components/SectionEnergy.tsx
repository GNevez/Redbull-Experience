"use client";

import { forwardRef, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FALL } from "@/lib/phases";
import type { ExperienceTimelines } from "./Experience";

gsap.registerPlugin(useGSAP);

interface SectionEnergyProps {
  timelines: ExperienceTimelines | null;
}

const SectionEnergy = forwardRef<HTMLElement, SectionEnergyProps>(
  function SectionEnergy({ timelines }, ref) {
    const stickyRef = useRef<HTMLDivElement>(null);

    useGSAP(
      () => {
        const sticky = stickyRef.current;
        if (!timelines || !sticky) return;
        const pieces = sticky.querySelectorAll("[data-reveal]");
        timelines.fall.fromTo(
          pieces,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.22, ease: "power3.out" },
          FALL.text,
        );
      },
      { scope: stickyRef, dependencies: [timelines] },
    );

    return (
      <section
        ref={ref}
        style={{ position: "relative", height: "300vh", zIndex: 1 }}
      >
        <div
          ref={stickyRef}
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "0 7vw",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.6rem",
              maxWidth: "min(46vw, 620px)",
              textAlign: "left",
            }}
          >
            <p
              data-reveal
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: "#8fa3c4",
                opacity: 0,
              }}
            >
              Energia em estado puro
            </p>
            <h2
              data-reveal
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontWeight: 400,
                textTransform: "uppercase",
                fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
                lineHeight: 1.02,
                color: "#f4f4f6",
                textShadow: "0 0 32px rgba(160, 190, 255, 0.18)",
                opacity: 0,
              }}
            >
              Asas para o seu dia.
            </h2>
            <p
              data-reveal
              style={{
                maxWidth: "480px",
                color: "#b9c4d8",
                fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                lineHeight: 1.7,
                opacity: 0,
              }}
            >
              Apreciada no mundo inteiro por atletas, criadores e sonhadores,
              Red Bull Energy Drink foi feita para os momentos que pedem foco,
              presença e performance do treino decisivo à madrugada de projeto.
            </p>
          </div>
        </div>
      </section>
    );
  },
);

export default SectionEnergy;
