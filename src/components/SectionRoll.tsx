"use client";

import { forwardRef, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ROLL } from "@/lib/phases";
import type { ExperienceTimelines } from "./Experience";

gsap.registerPlugin(useGSAP);

interface SectionRollProps {
  timelines: ExperienceTimelines | null;
}

const LINES = [
  "Cafeína e taurina para corpo e mente.",
  "Presente em mais de 170 países.",
  "Red Bull te dá asas.",
];

const SectionRoll = forwardRef<HTMLElement, SectionRollProps>(
  function SectionRoll({ timelines }, ref) {
    const stickyRef = useRef<HTMLDivElement>(null);

    useGSAP(
      () => {
        const sticky = stickyRef.current;
        if (!timelines || !sticky) return;
        const eyebrow = sticky.querySelector("[data-eyebrow]");
        if (eyebrow) {
          timelines.roll.fromTo(
            eyebrow,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out" },
            0.5,
          );
        }
        const lines = sticky.querySelectorAll("[data-line]");
        lines.forEach((line, i) => {
          timelines.roll.fromTo(
            line,
            { clipPath: "inset(0% 0% 0% 100%)", opacity: 0.85 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration: ROLL.revealDuration,
              ease: "power1.inOut",
            },
            ROLL.reveal + i * ROLL.revealStagger,
          );
        });
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
            justifyContent: "flex-end",
            padding: "0 7vw",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2.2rem",
              maxWidth: "min(46vw, 640px)",
              textAlign: "right",
            }}
          >
            <p
              data-eyebrow
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: "#8fa3c4",
                opacity: 0,
              }}
            >
              Por que Red Bull
            </p>
            {LINES.map((text, i) => (
              <p
                key={i}
                data-line
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  fontSize:
                    i === LINES.length - 1
                      ? "clamp(2.2rem, 4.8vw, 4.2rem)"
                      : "clamp(1.5rem, 3.2vw, 2.8rem)",
                  lineHeight: 1.12,
                  color: i === LINES.length - 1 ? "#e21b4d" : "#f4f4f6",
                  textShadow:
                    i === LINES.length - 1
                      ? "0 0 42px rgba(226, 27, 77, 0.35)"
                      : "0 0 28px rgba(160, 190, 255, 0.16)",
                  clipPath: "inset(0% 0% 0% 100%)",
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

export default SectionRoll;
