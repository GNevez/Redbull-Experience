"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export interface AdventureCard {
  caption: string;
  subtitle?: string;
  video: string;
  start: number;
  youtube: string;
}

interface VideoModalProps {
  card: AdventureCard;
  onClose: () => void;
}

const MODAL_BUBBLES = [
  { left: "8%", size: 12, dur: 5.4, delay: 0.2 },
  { left: "20%", size: 7, dur: 4.4, delay: 1.6 },
  { left: "33%", size: 15, dur: 6.4, delay: 0.8 },
  { left: "47%", size: 8, dur: 4.8, delay: 2.4 },
  { left: "61%", size: 13, dur: 5.8, delay: 0.4 },
  { left: "74%", size: 6, dur: 4.2, delay: 1.9 },
  { left: "86%", size: 16, dur: 6.8, delay: 1.1 },
  { left: "94%", size: 9, dur: 5.0, delay: 2.8 },
];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoModal({ card, onClose }: VideoModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closingRef = useRef(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [buffered, setBuffered] = useState(0);

  useGSAP(
    () => {
      const backdrop = backdropRef.current;
      const frame = frameRef.current;
      if (backdrop && frame) {
        gsap.fromTo(
          backdrop,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" },
        );
        gsap.fromTo(
          frame,
          { opacity: 0, scale: 0.9, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "power3.out" },
        );
        backdrop
          .querySelectorAll<SVGFETurbulenceElement>("feTurbulence")
          .forEach((node, i) => {
            const freq = { x: 0.011 + i * 0.004, y: 0.017 + i * 0.005 };
            gsap.to(freq, {
              x: freq.x * 1.55,
              y: freq.y * 1.45,
              duration: 5.5 + i * 2.1,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              onUpdate: () => {
                node.setAttribute("baseFrequency", `${freq.x} ${freq.y}`);
              },
            });
          });
      }
    },
    { scope: backdropRef },
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const backdrop = backdropRef.current;
    const frame = frameRef.current;
    if (!backdrop || !frame) {
      onClose();
      return;
    }
    gsap.to(frame, {
      opacity: 0,
      scale: 0.93,
      y: 26,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(backdrop, {
      opacity: 0,
      duration: 0.32,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (e.clientX - rect.left) / rect.width),
    );
    v.currentTime = ratio * duration;
  };

  const progress = duration ? (current / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={backdropRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background:
          "radial-gradient(115% 115% at 50% 28%, rgba(64, 42, 4, 0.6) 0%, rgba(10, 12, 20, 0.82) 58%, rgba(4, 5, 10, 0.92) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1.4rem, 4vw, 3.4rem)",
        pointerEvents: "auto",
        opacity: 0,
      }}
    >
      <style>
        {`
          @keyframes modalLiquidBubble {
            0% {
              opacity: 0;
              transform: translate3d(0, 0, 0) scale(0.75);
            }
            18% {
              opacity: 0.55;
            }
            72% {
              opacity: 0;
              transform: translate3d(0, -140px, 0) scale(1.05);
            }
            100% {
              opacity: 0;
              transform: translate3d(0, -140px, 0) scale(1.05);
            }
          }
        `}
      </style>
      <div onClick={close} style={{ position: "absolute", inset: 0 }} />

      <div
        ref={frameRef}
        style={{
          position: "relative",
          width: "min(1060px, 100%)",
          filter:
            "drop-shadow(0 46px 90px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 60px rgba(249, 194, 53, 0.16))",
          opacity: 0,
        }}
      >
        <svg
          width="0"
          height="0"
          aria-hidden="true"
          style={{ position: "absolute" }}
        >
          <defs>
            <filter
              id="modalLiquidEdgeOuter"
              x="-25%"
              y="-25%"
              width="150%"
              height="150%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.014 0.021"
                numOctaves="2"
                seed="26"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="30"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <filter
              id="modalLiquidEdgeInner"
              x="-25%"
              y="-25%"
              width="150%"
              height="150%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.011 0.017"
                numOctaves="2"
                seed="7"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="22"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        <div
          style={{
            position: "absolute",
            inset: "-26px",
            borderRadius: "46px",
            background: "linear-gradient(180deg, #f6bd1f 0%, #e2960a 100%)",
            filter: "url(#modalLiquidEdgeOuter)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "-13px",
            borderRadius: "36px",
            background:
              "linear-gradient(180deg, #ffdf7a 0%, #f9c235 55%, #f0a90e 100%)",
            filter: "url(#modalLiquidEdgeInner)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            borderRadius: "16px",
            background:
              "linear-gradient(180deg, #ffdf7a 0%, #f9c235 42%, #f0a90e 100%)",
            padding: "clamp(16px, 1.8vw, 24px)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            {MODAL_BUBBLES.map((b, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: b.left,
                  bottom: `-${b.size + 8}px`,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.1) 70%)",
                  filter: "blur(0.4px)",
                  animation: `modalLiquidBubble ${b.dur}s linear ${b.delay}s infinite`,
                  opacity: 0,
                }}
              />
            ))}
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              padding: "4px 6px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.9rem",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  width: "11px",
                  height: "11px",
                  borderRadius: "50%",
                  background: "#e21b4d",
                  boxShadow: "0 0 14px rgba(226, 27, 77, 0.7)",
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-display), sans-serif",
                    textTransform: "uppercase",
                    fontSize: "clamp(1.3rem, 2.1vw, 1.8rem)",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    color: "#12233f",
                  }}
                >
                  {card.caption}
                </p>
                {card.subtitle && (
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "0.76rem",
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "#8a5a00",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {card.subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={close}
              aria-label="Fechar"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e21b4d";
                const svg = e.currentTarget.querySelector("path");
                if (svg) svg.setAttribute("stroke", "#ffffff");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(18, 35, 63, 0.14)";
                const svg = e.currentTarget.querySelector("path");
                if (svg) svg.setAttribute("stroke", "#12233f");
              }}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(18, 35, 63, 0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background 0.2s ease",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 14 14">
                <path
                  d="M1 1 L13 13 M13 1 L1 13"
                  stroke="#12233f"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div
            ref={stageRef}
            onMouseEnter={() => {
              const c =
                stageRef.current?.querySelector<HTMLElement>("[data-center]");
              if (c) gsap.to(c, { opacity: 1, duration: 0.25 });
            }}
            onMouseLeave={() => {
              const c =
                stageRef.current?.querySelector<HTMLElement>("[data-center]");
              if (c && playing) gsap.to(c, { opacity: 0, duration: 0.4 });
            }}
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              background: "#0a1220",
              boxShadow:
                "inset 0 0 0 3px rgba(18, 35, 63, 0.28), 0 18px 40px rgba(120, 70, 0, 0.35)",
              aspectRatio: "16 / 9",
            }}
          >
            <video
              ref={videoRef}
              src={card.video}
              autoPlay
              playsInline
              onClick={togglePlay}
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                setDuration(v.duration);
                v.currentTime = card.start;
              }}
              onProgress={(e) => {
                const v = e.currentTarget;
                if (v.buffered.length) {
                  setBuffered(v.buffered.end(v.buffered.length - 1));
                }
              }}
              onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                cursor: "pointer",
              }}
            />

            <div
              data-center
              onClick={togglePlay}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.28), transparent 60%)",
                cursor: "pointer",
                opacity: 0,
              }}
            >
              <div
                style={{
                  width: "86px",
                  height: "86px",
                  borderRadius: "50%",
                  background: "rgba(226, 27, 77, 0.94)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 16px 40px rgba(226, 27, 77, 0.5)",
                }}
              >
                {playing ? (
                  <svg width="26" height="28" viewBox="0 0 24 26">
                    <rect x="3" y="2" width="6" height="22" rx="2" fill="#fff" />
                    <rect x="15" y="2" width="6" height="22" rx="2" fill="#fff" />
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 26">
                    <path d="M4 2 L22 13 L4 24 Z" fill="#fff" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div
            onClick={seek}
            style={{
              position: "relative",
              height: "24px",
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "8px",
                borderRadius: "999px",
                background: "rgba(18, 35, 63, 0.16)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${bufferedPct}%`,
                  background: "rgba(18, 35, 63, 0.12)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #e21b4d 0%, #ff5a36 100%)",
                }}
              />
            </div>
            <span
              style={{
                position: "absolute",
                left: `calc(${progress}% - 8px)`,
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#12233f",
                border: "3px solid #fdfaf4",
                boxShadow: "0 3px 10px rgba(80, 45, 0, 0.45)",
                pointerEvents: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 4px 4px",
            }}
          >
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pausar" : "Reproduzir"}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                border: "none",
                background: "#e21b4d",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 12px 26px rgba(180, 20, 60, 0.45)",
                flexShrink: 0,
              }}
            >
              {playing ? (
                <svg width="16" height="18" viewBox="0 0 14 16">
                  <rect x="1" y="1" width="4" height="14" rx="1.2" fill="#fff" />
                  <rect x="9" y="1" width="4" height="14" rx="1.2" fill="#fff" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 14 16">
                  <path d="M2 1.5 L13 8 L2 14.5 Z" fill="#fff" />
                </svg>
              )}
            </button>

            <span
              style={{
                fontSize: "0.92rem",
                color: "#12233f",
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
              }}
            >
              {formatTime(current)}
              <span style={{ color: "#8a5a00", fontWeight: 400 }}>
                {" "}
                / {formatTime(duration)}
              </span>
            </span>

            <div style={{ flex: 1 }} />

            <button
              onClick={toggleMute}
              aria-label={muted ? "Ativar som" : "Silenciar"}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(18, 35, 63, 0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {muted ? (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#12233f" />
                  <line
                    x1="16"
                    y1="8"
                    x2="22"
                    y2="16"
                    stroke="#e21b4d"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="22"
                    y1="8"
                    x2="16"
                    y2="16"
                    stroke="#e21b4d"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#12233f" />
                  <path
                    d="M16.5 8.5a5 5 0 0 1 0 7"
                    stroke="#12233f"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19 6a9 9 0 0 1 0 12"
                    stroke="#12233f"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            <a
              href={card.youtube}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.04,
                  duration: 0.2,
                  ease: "power2.out",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  duration: 0.25,
                  ease: "power2.out",
                });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 20px",
                borderRadius: "999px",
                background: "#ff0033",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
                boxShadow: "0 12px 26px rgba(200, 0, 40, 0.4)",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="15" viewBox="0 0 24 17">
                <path
                  d="M23.5 2.6A3 3 0 0 0 21.4.5C19.5 0 12 0 12 0S4.5 0 2.6.5A3 3 0 0 0 .5 2.6 31 31 0 0 0 0 8.5a31 31 0 0 0 .5 5.9 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-5.9 31 31 0 0 0-.5-5.9z"
                  fill="#ffffff"
                />
                <path d="M9.6 12.1V4.9l6.2 3.6-6.2 3.6z" fill="#ff0033" />
              </svg>
              Assistir no YouTube
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
