"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { LIQUID } from "@/lib/phases";
import type { ExperienceTimelines } from "./Experience";

gsap.registerPlugin(useGSAP);

interface LiquidOverlayProps {
  timelines: ExperienceTimelines | null;
}

const WAVE_PATH =
  "M0,0 H1200 V50 C1155,96 1108,102 1062,54 C1020,12 968,104 916,66 C868,32 822,118 776,72 C734,30 688,86 642,60 C596,36 552,108 506,64 C462,24 416,92 370,58 C328,28 282,102 236,64 C192,32 144,76 98,56 C62,42 28,60 0,50 Z";

const BUBBLES = [
  { left: "6%", size: 14, dur: 6.2, delay: 0 },
  { left: "13%", size: 8, dur: 4.8, delay: 1.4 },
  { left: "21%", size: 18, dur: 7.4, delay: 0.6 },
  { left: "29%", size: 10, dur: 5.2, delay: 2.2 },
  { left: "36%", size: 6, dur: 4.2, delay: 0.9 },
  { left: "44%", size: 16, dur: 6.8, delay: 1.8 },
  { left: "52%", size: 9, dur: 4.6, delay: 0.2 },
  { left: "60%", size: 20, dur: 7.8, delay: 2.6 },
  { left: "68%", size: 8, dur: 4.4, delay: 1.1 },
  { left: "76%", size: 13, dur: 5.8, delay: 0.4 },
  { left: "84%", size: 7, dur: 4.9, delay: 2.0 },
  { left: "92%", size: 17, dur: 7.0, delay: 1.5 },
];

const CARDS = [
  {
    caption: "Stratos",
    video: "/videos/stratos.mp4",
    poster: "/videos/poster-stratos.svg",
    tilt: -8,
    lift: "1.5rem",
  },
  {
    caption: "Cliff Diving",
    video: "/videos/cliff.mp4",
    poster: "/videos/poster-cliff.svg",
    tilt: 5,
    lift: "-1rem",
  },
  {
    caption: "Rampage",
    video: "/videos/rampage.mp4",
    poster: "/videos/poster-rampage.svg",
    tilt: -4,
    lift: "1rem",
  },
  {
    caption: "Dakar",
    video: "/videos/dakar.mp4",
    poster: "/videos/poster-dakar.svg",
    tilt: 7,
    lift: "-1.6rem",
  },
];

export default function LiquidOverlay({ timelines }: LiquidOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const liquidEl = liquidRef.current;
      if (!timelines || !root || !liquidEl) return;
      const { liquid } = timelines;

      liquid.fromTo(
        liquidEl,
        { top: "-112%" },
        {
          top: "0%",
          duration: LIQUID.floodDuration,
          ease: "power1.inOut",
        },
        LIQUID.flood,
      );

      const pieces = root.querySelectorAll("[data-liq]");
      liquid.fromTo(
        pieces,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" },
        LIQUID.headline,
      );

      const cards = root.querySelectorAll("[data-liq-card]");
      cards.forEach((el, i) => {
        liquid.fromTo(
          el,
          { yPercent: 170, rotation: CARDS[i].tilt * 2.6, opacity: 0 },
          {
            yPercent: 0,
            rotation: CARDS[i].tilt,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
          },
          LIQUID.cards + i * 0.22,
        );
      });
    },
    { scope: rootRef, dependencies: [timelines] },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      root.querySelectorAll("[data-wave]").forEach((el, i) => {
        gsap.to(el, {
          xPercent: -50,
          duration: i === 0 ? 9 : 13,
          ease: "none",
          repeat: -1,
        });
      });

      root.querySelectorAll("[data-bubble]").forEach((el, i) => {
        const cfg = BUBBLES[i];
        gsap.fromTo(
          el,
          { yPercent: 0, opacity: 0 },
          {
            keyframes: [
              { opacity: 0.75, duration: cfg.dur * 0.2 },
              { opacity: 0, duration: cfg.dur * 0.25 },
            ],
            yPercent: -1300,
            duration: cfg.dur,
            delay: cfg.delay,
            ease: "none",
            repeat: -1,
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 25,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        ref={liquidRef}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "100%",
          top: "-112%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, #ffdf7a 0%, #f9c235 38%, #f0a90e 78%, #e2960a 100%)",
          }}
        >
          {BUBBLES.map((b, i) => (
            <span
              key={i}
              data-bubble
              style={{
                position: "absolute",
                left: b.left,
                bottom: `-${b.size + 10}px`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.12) 70%)",
                filter: "blur(0.5px)",
                opacity: 0,
              }}
            />
          ))}
        </div>

        <div
          data-wave
          style={{
            position: "absolute",
            top: "calc(100% - 2px)",
            left: 0,
            width: "200%",
            height: "110px",
            display: "flex",
            opacity: 0.55,
          }}
        >
          <svg viewBox="0 0 1200 110" preserveAspectRatio="none" style={{ width: "50%", height: "100%" }}>
            <path d={WAVE_PATH} fill="#ffd75e" />
          </svg>
          <svg viewBox="0 0 1200 110" preserveAspectRatio="none" style={{ width: "50%", height: "100%" }}>
            <path d={WAVE_PATH} fill="#ffd75e" />
          </svg>
        </div>
        <div
          data-wave
          style={{
            position: "absolute",
            top: "calc(100% - 2px)",
            left: "-14%",
            width: "200%",
            height: "96px",
            display: "flex",
          }}
        >
          <svg viewBox="0 0 1200 110" preserveAspectRatio="none" style={{ width: "50%", height: "100%" }}>
            <path d={WAVE_PATH} fill="#e2960a" />
          </svg>
          <svg viewBox="0 0 1200 110" preserveAspectRatio="none" style={{ width: "50%", height: "100%" }}>
            <path d={WAVE_PATH} fill="#e2960a" />
          </svg>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2.6rem",
          padding: "0 5vw",
        }}
      >
        <div data-liq style={{ textAlign: "center", opacity: 0 }}>
          <p
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "#8a5a00",
              marginBottom: "0.9rem",
            }}
          >
            Mergulhe na energia
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 400,
              textTransform: "uppercase",
              fontSize: "clamp(2.4rem, 6vw, 5.4rem)",
              lineHeight: 1.0,
              color: "#12233f",
            }}
          >
            Aventuras movidas
            <br />a Red Bull.
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1.6rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {CARDS.map((card) => (
            <div
              key={card.caption}
              data-liq-card
              style={{
                background: "#fdfaf4",
                borderRadius: "24px",
                padding: "10px 10px 14px",
                boxShadow: "0 26px 50px rgba(90, 55, 0, 0.35)",
                marginTop: card.lift,
                opacity: 0,
              }}
            >
              <div
                style={{
                  width: "min(19vw, 250px)",
                  aspectRatio: "9 / 13",
                  borderRadius: "16px",
                  overflow: "hidden",
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
              </div>
              <p
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  fontFamily: "var(--font-display), sans-serif",
                  textTransform: "uppercase",
                  fontSize: "1rem",
                  letterSpacing: "0.08em",
                  color: "#1b130c",
                }}
              >
                {card.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
