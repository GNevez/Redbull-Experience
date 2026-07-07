"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { LEGENDS } from "@/lib/phases";
import type { ExperienceTimelines } from "./Experience";

gsap.registerPlugin(useGSAP);

interface SectionLegendsProps {
  timelines: ExperienceTimelines | null;
}

const BARS = [
  { color: "#12233f", at: 0 },
  { color: "#e21b4d", at: 0.13 },
  { color: "#f9c235", at: 0.26 },
  { color: "#f4f4f6", at: 0.39 },
];

const STARS = [
  { left: "6%", top: "12%", size: 3, delay: 0 },
  { left: "14%", top: "58%", size: 2, delay: 1.4 },
  { left: "21%", top: "28%", size: 2.5, delay: 0.7 },
  { left: "29%", top: "74%", size: 2, delay: 2.1 },
  { left: "36%", top: "16%", size: 3, delay: 1.1 },
  { left: "44%", top: "44%", size: 2, delay: 0.3 },
  { left: "52%", top: "10%", size: 2.5, delay: 1.8 },
  { left: "59%", top: "66%", size: 2, delay: 0.9 },
  { left: "66%", top: "24%", size: 3, delay: 2.4 },
  { left: "73%", top: "52%", size: 2, delay: 0.5 },
  { left: "81%", top: "14%", size: 2.5, delay: 1.6 },
  { left: "88%", top: "40%", size: 2, delay: 0.2 },
  { left: "93%", top: "70%", size: 3, delay: 1.2 },
  { left: "11%", top: "86%", size: 2, delay: 2.7 },
  { left: "47%", top: "84%", size: 2.5, delay: 1.9 },
  { left: "84%", top: "88%", size: 2, delay: 0.8 },
];

interface Athlete {
  first: string;
  last: string;
  eyebrow: string;
  feat: string;
  chips: string[];
  img: string;
  accent: string;
  glow: string;
  bg: string;
  side: "left" | "right" | "center";
  years?: string;
  memorial?: string;
}

const ATHLETES: Athlete[] = [
  {
    first: "Max",
    last: "Verstappen",
    eyebrow: "Fórmula 1 · Red Bull Racing",
    feat: "Tetracampeão mundial e a referência absoluta da velocidade moderna.",
    chips: ["4 títulos mundiais", "60+ vitórias"],
    img: "/athletes/max.png",
    accent: "#e21b4d",
    glow: "rgba(226, 27, 77, 0.4)",
    bg: "radial-gradient(110% 90% at 24% 40%, rgba(226, 27, 77, 0.2) 0%, transparent 55%)",
    side: "left",
  },
  {
    first: "Marc",
    last: "Márquez",
    eyebrow: "MotoGP · #93",
    feat: "Nove títulos mundiais sobre duas rodas e coragem que dobra a física.",
    chips: ["9 títulos mundiais", "#93"],
    img: "/athletes/marquez.png",
    accent: "#ff5a36",
    glow: "rgba(255, 90, 54, 0.4)",
    bg: "radial-gradient(110% 90% at 76% 40%, rgba(255, 90, 54, 0.2) 0%, transparent 55%)",
    side: "right",
  },
  {
    first: "Letícia",
    last: "Bufoni",
    eyebrow: "Skate Street · Brasil",
    feat: "A rainha do street que levou o skate brasileiro para o topo do mundo.",
    chips: ["6 ouros no X Games", "São Paulo · BR"],
    img: "/athletes/bufoni.png",
    accent: "#ff2d78",
    glow: "rgba(255, 45, 120, 0.4)",
    bg: "radial-gradient(110% 90% at 24% 40%, rgba(255, 45, 120, 0.18) 0%, transparent 55%)",
    side: "left",
  },
  {
    first: "Felix",
    last: "Baumgartner",
    eyebrow: "Red Bull Stratos",
    years: "1969 — 2025",
    feat: "Saltou da estratosfera e provou que o céu nunca foi o limite.",
    memorial: "Em memória. Obrigado por nos ensinar a voar. ✦",
    chips: ["39.000 m", "1.357 km/h"],
    img: "/athletes/felix.png",
    accent: "#9db8e8",
    glow: "rgba(157, 184, 232, 0.35)",
    bg: "radial-gradient(120% 100% at 50% 30%, rgba(157, 184, 232, 0.14) 0%, transparent 60%)",
    side: "center",
  },
];

export default function SectionLegends({ timelines }: SectionLegendsProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      gsap.set(root.querySelectorAll("[data-bar]"), {
        xPercent: -160,
        skewX: -14,
      });
      gsap.set(root.querySelector("[data-word]"), { xPercent: 90 });

      if (!timelines) return;
      const { legends } = timelines;

      const arena = root.querySelector("[data-arena]");
      if (arena) {
        legends.fromTo(
          arena,
          { clipPath: "polygon(-30% 0%, -8% 0%, -30% 100%, -52% 100%)" },
          {
            clipPath: "polygon(-30% 0%, 152% 0%, 130% 100%, -52% 100%)",
            duration: 0.8,
            ease: "power2.inOut",
          },
          LEGENDS.bgReveal,
        );
      }

      root.querySelectorAll("[data-bar]").forEach((el, i) => {
        legends.fromTo(
          el,
          { xPercent: -160 },
          { xPercent: 160, duration: 0.8, ease: "power2.inOut" },
          LEGENDS.bars + BARS[i].at,
        );
      });

      const word = root.querySelector("[data-word]");
      if (word) {
        legends.set(word, { opacity: 1 }, LEGENDS.word);
        legends.fromTo(
          word,
          { xPercent: 90 },
          { xPercent: -110, duration: 1.05, ease: "none" },
          LEGENDS.word,
        );
        legends.to(word, { opacity: 0, duration: 0.12 }, LEGENDS.word + 1.05);
      }

      const label = root.querySelector("[data-label]");
      if (label) {
        legends.fromTo(
          label,
          { opacity: 0, y: -14 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          LEGENDS.bgReveal + 0.5,
        );
      }

      const flash = root.querySelector("[data-flash]");
      if (flash) {
        legends.to(
          flash,
          {
            keyframes: [
              { opacity: 0.85, duration: 0.05 },
              { opacity: 0, duration: 0.1 },
              { opacity: 0.6, duration: 0.04 },
              { opacity: 0, duration: 0.12 },
            ],
          },
          LEGENDS.flash,
        );
      }

      const chapters = root.querySelectorAll("[data-chapter]");
      chapters.forEach((layer, i) => {
        const at = LEGENDS.chapters[i];
        const isLast = i === ATHLETES.length - 1;

        legends.fromTo(
          layer,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" },
          at,
        );
        if (!isLast) {
          legends.to(
            layer,
            { opacity: 0, duration: 0.28, ease: "power2.in" },
            at + LEGENDS.chapterDur - 0.24,
          );
        }

        const bgName = layer.querySelector("[data-bgname]");
        if (bgName) {
          legends.fromTo(
            bgName,
            { xPercent: -7 },
            {
              xPercent: 7,
              duration: isLast ? LEGENDS.chapterDur + 0.6 : LEGENDS.chapterDur,
              ease: "none",
            },
            at,
          );
        }

        const img = layer.querySelector("[data-cutout]");
        if (img) {
          legends.fromTo(
            img,
            { clipPath: "inset(100% 0% 0% 0%)", y: 60 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              duration: 0.55,
              ease: "power3.out",
            },
            at + 0.08,
          );
          legends.to(
            img,
            { y: -16, duration: isLast ? 1.4 : 0.85, ease: "sine.inOut" },
            at + 0.65,
          );
        }

        const infoBits = layer.querySelectorAll("[data-info]");
        legends.fromTo(
          infoBits,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.09,
            ease: "power3.out",
          },
          at + 0.18,
        );
      });

      root.querySelectorAll("[data-rail-item]").forEach((el, i) => {
        const at = LEGENDS.chapters[i];
        const isLast = i === ATHLETES.length - 1;
        legends.fromTo(
          el,
          { opacity: 0.28 },
          { opacity: 1, duration: 0.25 },
          at,
        );
        if (!isLast) {
          legends.to(
            el,
            { opacity: 0.28, duration: 0.25 },
            at + LEGENDS.chapterDur - 0.24,
          );
        }
      });

      const rail = root.querySelector("[data-rail]");
      if (rail) {
        legends.fromTo(
          rail,
          { opacity: 0, x: 24 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
          LEGENDS.chapters[0] - 0.1,
        );
      }

      const stars = root.querySelector("[data-stars]");
      if (stars) {
        legends.fromTo(
          stars,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power1.inOut" },
          LEGENDS.chapters[3] - 0.2,
        );
      }

      timelines.finale.to(
        root,
        { opacity: 0, yPercent: -26, duration: 0.3, ease: "power2.in" },
        0.02,
      );
    },
    { scope: rootRef, dependencies: [timelines] },
  );

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 28,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <style>
        {`
          @keyframes legendStar {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.9; }
          }
        `}
      </style>

      <div
        data-arena
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(175deg, #0b1322 0%, #0a1120 55%, #060a13 100%)",
          clipPath: "polygon(-30% 0%, -8% 0%, -30% 100%, -52% 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1.4px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 45%, transparent 45%, rgba(2, 4, 9, 0.55) 100%)",
          }}
        />
      </div>

      <div
        data-stars
        style={{ position: "absolute", inset: 0, opacity: 0 }}
      >
        {STARS.map((s, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: s.left,
              top: s.top,
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: "50%",
              background: "#dfe8ff",
              animation: `legendStar ${2.6 + (i % 3)}s ease-in-out ${s.delay}s infinite`,
              opacity: 0.15,
            }}
          />
        ))}
      </div>

      {ATHLETES.map((a, i) => (
        <div
          key={a.last}
          data-chapter
          style={{ position: "absolute", inset: 0, opacity: 0 }}
        >
          <div style={{ position: "absolute", inset: 0, background: a.bg }} />

          <div
            data-bgname
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: a.side === "center" ? "flex-start" : "center",
              justifyContent: "center",
              paddingTop: a.side === "center" ? "6vh" : 0,
              fontFamily: "var(--font-display), sans-serif",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              fontSize: "clamp(7rem, 17vw, 16rem)",
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.07)",
            }}
          >
            {a.last}
          </div>

          {a.side !== "center" ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: a.side === "left" ? "row" : "row-reverse",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(2rem, 6vw, 7rem)",
                padding: "0 7vw",
              }}
            >
              <img
                data-cutout
                src={a.img}
                alt={`${a.first} ${a.last}`}
                style={{
                  height: "min(68vh, 640px)",
                  filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.5)) drop-shadow(0 0 46px ${a.glow})`,
                  flexShrink: 0,
                }}
              />
              <div style={{ maxWidth: "520px" }}>
                <p
                  data-info
                  style={{
                    fontSize: "0.8rem",
                    letterSpacing: "0.42em",
                    textTransform: "uppercase",
                    color: a.accent,
                    marginBottom: "1.1rem",
                    opacity: 0,
                  }}
                >
                  {a.eyebrow}
                </p>
                <h3
                  data-info
                  style={{
                    fontFamily: "var(--font-display), sans-serif",
                    fontWeight: 400,
                    textTransform: "uppercase",
                    fontSize: "clamp(2.6rem, 5.4vw, 4.8rem)",
                    lineHeight: 0.98,
                    opacity: 0,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color: "transparent",
                      WebkitTextStroke: `2px ${a.accent}`,
                    }}
                  >
                    {a.first}
                  </span>
                  <span style={{ display: "block", color: "#f4f4f6" }}>
                    {a.last}
                  </span>
                </h3>
                <p
                  data-info
                  style={{
                    marginTop: "1.2rem",
                    color: "#b9c4d8",
                    fontSize: "clamp(1rem, 1.35vw, 1.15rem)",
                    lineHeight: 1.65,
                    opacity: 0,
                  }}
                >
                  {a.feat}
                </p>
                <div
                  data-info
                  style={{
                    display: "flex",
                    gap: "0.8rem",
                    marginTop: "1.5rem",
                    flexWrap: "wrap",
                    opacity: 0,
                  }}
                >
                  {a.chips.map((chip) => (
                    <span
                      key={chip}
                      style={{
                        padding: "0.55rem 1.05rem",
                        borderRadius: "999px",
                        border: `1.5px solid ${a.accent}`,
                        color: "#f4f4f6",
                        fontSize: "0.85rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.1rem",
                padding: "0 7vw",
                textAlign: "center",
              }}
            >
              <p
                data-info
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: a.accent,
                  opacity: 0,
                }}
              >
                {a.eyebrow}
              </p>
              <h3
                data-info
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  fontSize: "clamp(2.6rem, 5vw, 4.6rem)",
                  lineHeight: 1,
                  color: "#f4f4f6",
                  opacity: 0,
                }}
              >
                {a.first} {a.last}
              </h3>
              <p
                data-info
                style={{
                  fontSize: "0.95rem",
                  letterSpacing: "0.5em",
                  color: "#8fa3c4",
                  opacity: 0,
                }}
              >
                {a.years}
              </p>
              <img
                data-cutout
                src={a.img}
                alt={`${a.first} ${a.last}`}
                style={{
                  height: "min(46vh, 430px)",
                  marginTop: "0.6rem",
                  filter: `drop-shadow(0 24px 50px rgba(0,0,0,0.5)) drop-shadow(0 0 52px ${a.glow})`,
                }}
              />
              <p
                data-info
                style={{
                  marginTop: "0.8rem",
                  maxWidth: "560px",
                  color: "#b9c4d8",
                  fontSize: "clamp(0.98rem, 1.3vw, 1.1rem)",
                  lineHeight: 1.65,
                  opacity: 0,
                }}
              >
                {a.feat}
              </p>
              <p
                data-info
                style={{
                  color: "#8fa3c4",
                  fontSize: "0.86rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0,
                }}
              >
                {a.memorial}
              </p>
              <div
                data-info
                style={{
                  display: "flex",
                  gap: "0.8rem",
                  marginTop: "0.4rem",
                  opacity: 0,
                }}
              >
                {a.chips.map((chip) => (
                  <span
                    key={chip}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "999px",
                      border: `1.5px solid rgba(157, 184, 232, 0.55)`,
                      color: "#dfe8ff",
                      fontSize: "0.82rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div
        data-rail
        style={{
          position: "absolute",
          right: "2.4vw",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          opacity: 0,
        }}
      >
        {ATHLETES.map((a, i) => (
          <div
            key={a.last}
            data-rail-item
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              opacity: 0.28,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "0.85rem",
                color: "#f4f4f6",
                letterSpacing: "0.1em",
              }}
            >
              0{i + 1}
            </span>
            <span
              style={{
                width: "26px",
                height: "2px",
                background: a.accent,
              }}
            />
          </div>
        ))}
      </div>

      <p
        data-label
        style={{
          position: "absolute",
          left: "50%",
          top: "4.6vh",
          transform: "translateX(-50%)",
          fontSize: "0.75rem",
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "rgba(143, 163, 196, 0.7)",
          opacity: 0,
        }}
      >
        Hall das Lendas
      </p>

      {BARS.map((b, i) => (
        <div
          key={i}
          data-bar
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "120%",
            height: "140%",
            background: b.color,
          }}
        />
      ))}

      <div
        data-word
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-display), sans-serif",
          textTransform: "uppercase",
          fontSize: "clamp(9rem, 24vw, 22rem)",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "3px #f4f4f6",
          opacity: 0,
        }}
      >
        Lendas
      </div>

      <div
        data-flash
        style={{
          position: "absolute",
          inset: 0,
          background: "#ffffff",
          opacity: 0,
        }}
      />
    </div>
  );
}
