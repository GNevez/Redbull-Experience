"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

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

  useEffect(() => {
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
        { opacity: 0, scale: 0.9, y: 34 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "power3.out" },
      );
    }

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
      y: 22,
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

  const iconBtn: React.CSSProperties = {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(255, 255, 255, 0.06)",
    color: "#f4f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background 0.2s ease",
  };

  return (
    <div
      ref={backdropRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background:
          "radial-gradient(120% 120% at 50% 30%, rgba(38, 26, 6, 0.72) 0%, rgba(8, 10, 18, 0.86) 55%, rgba(4, 5, 10, 0.94) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem, 4vw, 3rem)",
        pointerEvents: "auto",
        opacity: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          width: "70vw",
          height: "60vh",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(249, 194, 53, 0.22) 0%, transparent 68%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div onClick={close} style={{ position: "absolute", inset: 0 }} />

      <div
        ref={frameRef}
        style={{
          position: "relative",
          width: "min(1120px, 100%)",
          borderRadius: "30px",
          padding: "1.5px",
          background:
            "linear-gradient(155deg, rgba(255, 255, 255, 0.28) 0%, rgba(249, 194, 53, 0.22) 26%, rgba(255, 255, 255, 0.04) 55%, rgba(226, 27, 77, 0.24) 100%)",
          boxShadow:
            "0 60px 140px rgba(0, 0, 0, 0.7), 0 0 90px rgba(249, 194, 53, 0.08)",
          opacity: 0,
        }}
      >
        <div
          style={{
            borderRadius: "28.5px",
            background:
              "linear-gradient(168deg, #16233b 0%, #0c1526 52%, #080e1a 100%)",
            padding: "clamp(14px, 1.6vw, 22px)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              padding: "2px 4px 14px",
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
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#e21b4d",
                  boxShadow: "0 0 16px rgba(226, 27, 77, 0.9)",
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-display), sans-serif",
                    textTransform: "uppercase",
                    fontSize: "clamp(1.25rem, 2vw, 1.7rem)",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    color: "#f4f4f6",
                  }}
                >
                  {card.caption}
                </p>
                {card.subtitle && (
                  <p
                    style={{
                      marginTop: "5px",
                      fontSize: "0.78rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#8fa3c4",
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(226, 27, 77, 0.85)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)")
              }
              style={{ ...iconBtn }}
            >
              <svg width="15" height="15" viewBox="0 0 14 14">
                <path
                  d="M1 1 L13 13 M13 1 L1 13"
                  stroke="#f4f4f6"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div
            ref={stageRef}
            onMouseEnter={() => {
              const c = stageRef.current?.querySelector<HTMLElement>(
                "[data-center]",
              );
              if (c) gsap.to(c, { opacity: 1, duration: 0.25 });
            }}
            onMouseLeave={() => {
              const c = stageRef.current?.querySelector<HTMLElement>(
                "[data-center]",
              );
              if (c && playing) gsap.to(c, { opacity: 0, duration: 0.4 });
            }}
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              background: "#05070c",
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
                  width: "84px",
                  height: "84px",
                  borderRadius: "50%",
                  background: "rgba(226, 27, 77, 0.92)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 16px 40px rgba(226, 27, 77, 0.5)",
                  backdropFilter: "blur(2px)",
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
              height: "22px",
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
                height: "6px",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.12)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${bufferedPct}%`,
                  background: "rgba(255, 255, 255, 0.16)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #e21b4d 0%, #f9c235 100%)",
                }}
              />
            </div>
            <span
              style={{
                position: "absolute",
                left: `calc(${progress}% - 7px)`,
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                pointerEvents: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 4px 2px",
            }}
          >
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pausar" : "Reproduzir"}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "none",
                background: "#e21b4d",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 12px 28px rgba(226, 27, 77, 0.42)",
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
                fontSize: "0.9rem",
                color: "#c7d2e4",
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
              }}
            >
              {formatTime(current)}
              <span style={{ color: "#5c6a80" }}> / {formatTime(duration)}</span>
            </span>

            <div style={{ flex: 1 }} />

            <button
              onClick={toggleMute}
              aria-label={muted ? "Ativar som" : "Silenciar"}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)")
              }
              style={{ ...iconBtn }}
            >
              {muted ? (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#f4f4f6" />
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
                  <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#f4f4f6" />
                  <path
                    d="M16.5 8.5a5 5 0 0 1 0 7"
                    stroke="#f4f4f6"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19 6a9 9 0 0 1 0 12"
                    stroke="#f4f4f6"
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
                boxShadow: "0 12px 30px rgba(255, 0, 51, 0.38)",
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
