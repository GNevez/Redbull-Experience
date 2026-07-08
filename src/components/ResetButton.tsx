"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LEGENDS } from "@/lib/phases";
import type { ExperienceTimelines } from "./Experience";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ResetButtonProps {
  timelines: ExperienceTimelines | null;
}

export default function ResetButton({ timelines }: ResetButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const visibleRef = useRef(false);

  useGSAP(
    () => {
      const button = buttonRef.current;
      if (!timelines || !button) return;

      gsap.set(button, { xPercent: -50, opacity: 0, y: 16 });

      const tick = () => {
        const pastHero = window.scrollY > window.innerHeight * 1.2;
        const memorial =
          timelines.legends.time() > LEGENDS.chapters[3] - 0.2 &&
          timelines.finale.time() < 0.55;
        const show = pastHero && !memorial && !busyRef.current;
        if (show === visibleRef.current) return;
        visibleRef.current = show;
        button.style.pointerEvents = show ? "auto" : "none";
        gsap.to(button, {
          opacity: show ? 1 : 0,
          y: show ? 0 : 16,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { dependencies: [timelines] },
  );

  const handleReset = () => {
    const cover = coverRef.current;
    if (!timelines || !cover || busyRef.current) return;
    busyRef.current = true;

    gsap
      .timeline({
        onComplete: () => {
          busyRef.current = false;
        },
      })
      .set(cover, { pointerEvents: "auto" })
      .to(cover, { opacity: 1, duration: 0.45, ease: "power2.in" })
      .add(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        timelines.burst.timeScale(1).pause(0);
        window.dispatchEvent(new Event("experience-reset"));
        ScrollTrigger.update();
      })
      .to(cover, { opacity: 0, duration: 0.7, ease: "power2.out" }, "+=1.1")
      .set(cover, { pointerEvents: "none" });
  };

  return (
    <>
      <div
        ref={coverRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "#05080f",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <button
        ref={buttonRef}
        type="button"
        onClick={handleReset}
        onMouseEnter={(e) => {
          gsap.to(e.currentTarget, {
            scale: 1.06,
            backgroundColor: "rgba(226, 27, 77, 0.92)",
            borderColor: "rgba(226, 27, 77, 0.9)",
            color: "#f4f4f6",
            duration: 0.3,
            ease: "power2.out",
          });
        }}
        onMouseLeave={(e) => {
          gsap.to(e.currentTarget, {
            scale: 1,
            backgroundColor: "rgba(8, 13, 24, 0.55)",
            borderColor: "rgba(255, 255, 255, 0.18)",
            color: "#c7d2e4",
            duration: 0.35,
            ease: "power2.out",
          });
        }}
        style={{
          position: "fixed",
          left: "50%",
          bottom: "2.6vh",
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.62rem 1.25rem",
          borderRadius: "999px",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          background: "rgba(8, 13, 24, 0.55)",
          backdropFilter: "blur(8px)",
          color: "#c7d2e4",
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          cursor: "pointer",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M3.5 12a8.5 8.5 0 1 1 2.5 6" />
          <path d="M6 21.5v-3.8h3.8" />
        </svg>
        Resetar experiência
      </button>
    </>
  );
}
