"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface AdventureCard {
  caption: string;
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const closingRef = useRef(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const frame = frameRef.current;
    if (backdrop && frame) {
      gsap.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );
      gsap.fromTo(
        frame,
        { opacity: 0, scale: 0.92, y: 26 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" },
      );
    }

    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
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
      scale: 0.94,
      y: 18,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(backdrop, {
      opacity: 0,
      duration: 0.28,
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

  return (
    <div
      ref={backdropRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(3, 6, 14, 0.88)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        opacity: 0,
      }}
    >
      <div onClick={close} style={{ position: "absolute", inset: 0 }} />

      <div
        ref={frameRef}
        style={{
          position: "relative",
          width: "min(1080px, 92vw)",
          background: "linear-gradient(165deg, #101b30 0%, #0a1220 100%)",
          border: "1px solid rgba(255, 255, 255, 0.09)",
          borderRadius: "28px",
          padding: "18px 18px 16px",
          boxShadow: "0 50px 120px rgba(0, 0, 0, 0.6)",
          opacity: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "2px 6px 12px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display), sans-serif",
              textTransform: "uppercase",
              fontSize: "1.35rem",
              letterSpacing: "0.06em",
              color: "#f4f4f6",
            }}
          >
            {card.caption}
          </p>
          <button
            onClick={close}
            aria-label="Fechar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f6",
              fontSize: "1.1rem",
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            borderRadius: "18px",
            overflow: "hidden",
            background: "#000000",
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
            onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            style={{
              width: "100%",
              maxHeight: "66vh",
              display: "block",
              cursor: "pointer",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "14px 6px 2px",
          }}
        >
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pausar" : "Reproduzir"}
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              border: "none",
              background: "#e21b4d",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 10px 24px rgba(226, 27, 77, 0.4)",
              flexShrink: 0,
            }}
          >
            {playing ? (
              <svg width="15" height="16" viewBox="0 0 14 16">
                <rect x="1" y="1" width="4" height="14" rx="1.2" fill="#fff" />
                <rect x="9" y="1" width="4" height="14" rx="1.2" fill="#fff" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 14 16">
                <path d="M2 1.5 L13 8 L2 14.5 Z" fill="#fff" />
              </svg>
            )}
          </button>

          <span
            style={{
              fontSize: "0.85rem",
              color: "#8fa3c4",
              fontVariantNumeric: "tabular-nums",
              flexShrink: 0,
            }}
          >
            {formatTime(current)}
          </span>

          <div
            onClick={seek}
            style={{
              flex: 1,
              height: "18px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "6px",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.14)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  borderRadius: "999px",
                  background:
                    "linear-gradient(90deg, #e21b4d 0%, #ffd300 100%)",
                }}
              />
            </div>
          </div>

          <span
            style={{
              fontSize: "0.85rem",
              color: "#8fa3c4",
              fontVariantNumeric: "tabular-nums",
              flexShrink: 0,
            }}
          >
            {formatTime(duration)}
          </span>

          <button
            onClick={toggleMute}
            aria-label={muted ? "Ativar som" : "Silenciar"}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 9v6h4l5 4V5L8 9H4z"
                  fill="#f4f4f6"
                />
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              padding: "11px 18px",
              borderRadius: "999px",
              background: "#ff0033",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "0.88rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              boxShadow: "0 10px 26px rgba(255, 0, 51, 0.35)",
              flexShrink: 0,
            }}
          >
            <svg width="19" height="14" viewBox="0 0 24 17">
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
  );
}
