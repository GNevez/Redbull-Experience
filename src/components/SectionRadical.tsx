"use client";

import { forwardRef, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RADICAL } from "@/lib/phases";
import type { ExperienceTimelines } from "./Experience";

gsap.registerPlugin(useGSAP);

interface SectionRadicalProps {
  timelines: ExperienceTimelines | null;
}

const STREAKS = [
  { top: "34%", width: "26vw", height: "4px", color: "rgba(226, 27, 77, 0.55)", at: 0.0 },
  { top: "46%", width: "34vw", height: "5px", color: "rgba(255, 255, 255, 0.6)", at: 0.12 },
  { top: "58%", width: "22vw", height: "3px", color: "rgba(18, 35, 63, 0.5)", at: 0.22 },
];

const SectionRadical = forwardRef<HTMLElement, SectionRadicalProps>(
  function SectionRadical({ timelines }, ref) {
    const stickyRef = useRef<HTMLDivElement>(null);

    useGSAP(
      () => {
        const sticky = stickyRef.current;
        if (!timelines || !sticky) return;
        const { radical } = timelines;

        const bg = sticky.querySelector("[data-bg]");
        if (bg) {
          radical.fromTo(
            bg,
            { clipPath: "polygon(0% 0%, -22% 0%, -8% 100%, 0% 100%)" },
            {
              clipPath: "polygon(0% 0%, 106% 0%, 120% 100%, 0% 100%)",
              duration: RADICAL.sweepDuration,
              ease: "power1.inOut",
            },
            RADICAL.sweep + 0.04,
          );
        }

        const streaks = sticky.querySelectorAll("[data-streak]");
        streaks.forEach((el, i) => {
          radical.fromTo(
            el,
            { xPercent: -160, opacity: 0 },
            {
              keyframes: [
                { xPercent: -40, opacity: 0.9, duration: 0.35, ease: "power1.in" },
                { xPercent: 460, opacity: 0, duration: 0.55, ease: "power2.out" },
              ],
            },
            RADICAL.sweep + STREAKS[i].at,
          );
        });

        const marqueeL = sticky.querySelector("[data-marquee-l]");
        if (marqueeL) {
          radical.fromTo(
            marqueeL,
            { xPercent: -6 },
            { xPercent: -26, duration: 5, ease: "none" },
            0,
          );
        }
        const marqueeR = sticky.querySelector("[data-marquee-r]");
        if (marqueeR) {
          radical.fromTo(
            marqueeR,
            { xPercent: -26 },
            { xPercent: -6, duration: 5, ease: "none" },
            0,
          );
        }

        const pieces = sticky.querySelectorAll("[data-rad]");
        radical.fromTo(
          pieces,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.24,
            ease: "power3.out",
          },
          RADICAL.content,
        );
      },
      { scope: stickyRef, dependencies: [timelines] },
    );

    return (
      <section
        ref={ref}
        style={{ position: "relative", height: "350vh", zIndex: 1 }}
      >
        <div
          ref={stickyRef}
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            data-bg
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(160deg, #f7f2e9 0%, #f1e9db 55%, #ece1cf 100%)",
              clipPath: "polygon(0% 0%, -22% 0%, -8% 100%, 0% 100%)",
            }}
          />

          {STREAKS.map((s, i) => (
            <div
              key={i}
              data-streak
              style={{
                position: "absolute",
                top: s.top,
                left: 0,
                width: s.width,
                height: s.height,
                borderRadius: "999px",
                background: `linear-gradient(90deg, transparent, ${s.color})`,
                transform: "skewX(-18deg)",
                opacity: 0,
              }}
            />
          ))}

          <div
            style={{
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.4rem",
              padding: "0",
              textAlign: "center",
            }}
          >
            <p
              data-rad
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: "#a8917a",
                opacity: 0,
              }}
            >
              Além da lata
            </p>

            <div
              data-rad
              data-marquee-l
              style={{
                width: "max-content",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-display), sans-serif",
                textTransform: "uppercase",
                fontSize: "clamp(4rem, 10vw, 9rem)",
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: "2px rgba(27, 19, 12, 0.5)",
                opacity: 0,
              }}
            >
              Radical é o nosso normal — Radical é o nosso normal — Radical é o
              nosso normal —
            </div>

            <h2
              data-rad
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontWeight: 400,
                textTransform: "uppercase",
                fontSize: "clamp(3rem, 8.5vw, 8rem)",
                lineHeight: 1.05,
                color: "#1b130c",
                padding: "0 6vw",
                opacity: 0,
              }}
            >
              Radical é o{" "}
              <span
                style={{
                  display: "inline-block",
                  background: "#e21b4d",
                  color: "#fdfaf4",
                  padding: "0.02em 0.18em 0.06em",
                  borderRadius: "16px",
                  transform: "rotate(-2deg)",
                  boxShadow: "0 18px 40px rgba(226, 27, 77, 0.35)",
                }}
              >
                nosso normal.
              </span>
            </h2>

            <div
              data-rad
              data-marquee-r
              style={{
                width: "max-content",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-display), sans-serif",
                textTransform: "uppercase",
                fontSize: "clamp(2rem, 4.6vw, 4rem)",
                lineHeight: 1.05,
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(226, 27, 77, 0.7)",
                opacity: 0,
              }}
            >
              F1 · Stratos · Cliff Diving · Rampage · Dakar · Surf · Breaking —
              F1 · Stratos · Cliff Diving · Rampage · Dakar · Surf · Breaking —
            </div>

            <p
              data-rad
              style={{
                maxWidth: "620px",
                padding: "0 6vw",
                color: "#6b5d4b",
                fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
                lineHeight: 1.7,
                opacity: 0,
              }}
            >
              Do salto da estratosfera ao pódio da Fórmula 1 a Red Bull vive
              onde a adrenalina mora.
            </p>
          </div>
        </div>
      </section>
    );
  },
);

export default SectionRadical;
