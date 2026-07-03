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

const CARDS = [
  {
    caption: "Fórmula 1",
    video: "/videos/f1.mp4",
    poster: "/videos/poster-f1.svg",
    tilt: "-4deg",
  },
  {
    caption: "Cliff Diving",
    video: "/videos/cliff.mp4",
    poster: "/videos/poster-cliff.svg",
    tilt: "3.5deg",
  },
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
            { clipPath: "inset(0% 100% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: RADICAL.sweepDuration + 0.2,
              ease: "power1.inOut",
            },
            RADICAL.sweep + 0.05,
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
              clipPath: "inset(0% 100% 0% 0%)",
            }}
          />

          <div
            style={{
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3.2rem",
              padding: "0 6vw",
            }}
          >
            <div data-rad style={{ textAlign: "center", opacity: 0 }}>
              <p
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  color: "#a8917a",
                  marginBottom: "1rem",
                }}
              >
                Além da lata
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  fontSize: "clamp(2.4rem, 6vw, 5.2rem)",
                  lineHeight: 1.02,
                  color: "#1b130c",
                }}
              >
                Radical é o nosso normal.
              </h2>
              <p
                style={{
                  maxWidth: "640px",
                  margin: "1.2rem auto 0",
                  color: "#6b5d4b",
                  fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                  lineHeight: 1.7,
                }}
              >
                Do salto da estratosfera ao pódio da Fórmula 1 — a Red Bull
                vive onde a adrenalina mora.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "3.4rem",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {CARDS.map((card) => (
                <div
                  key={card.caption}
                  data-rad
                  style={{
                    position: "relative",
                    width: "min(36vw, 480px)",
                    aspectRatio: "16 / 10",
                    borderRadius: "28px",
                    overflow: "hidden",
                    transform: `rotate(${card.tilt})`,
                    boxShadow: "0 30px 60px rgba(27, 19, 12, 0.28)",
                    opacity: 0,
                  }}
                >
                  <video
                    src={card.video}
                    poster={card.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.92)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(27, 19, 12, 0.35)",
                    }}
                  >
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        marginLeft: "5px",
                        borderTop: "11px solid transparent",
                        borderBottom: "11px solid transparent",
                        borderLeft: "18px solid #e21b4d",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      position: "absolute",
                      left: "1.4rem",
                      bottom: "1.1rem",
                      fontFamily: "var(--font-display), sans-serif",
                      textTransform: "uppercase",
                      fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                      color: "#fdfaf4",
                      textShadow: "0 4px 18px rgba(0, 0, 0, 0.55)",
                    }}
                  >
                    {card.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

export default SectionRadical;
