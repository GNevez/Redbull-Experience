"use client";

import { forwardRef, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { FINALE } from "@/lib/phases";
import type { ExperienceTimelines } from "./Experience";

gsap.registerPlugin(useGSAP, SplitText);

interface SectionFinaleProps {
  timelines: ExperienceTimelines | null;
}

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/GNevez",
    icon: (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/guilherme-neves-ferraz/",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nevess.__/",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="2.5"
          y="2.5"
          width="19"
          height="19"
          rx="5.5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.4" cy="6.6" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "E-mail",
    href: "mailto:guilhermenferraz@gmail.com",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="2.5"
          y="4.5"
          width="19"
          height="15"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M3.5 7 L12 13 L20.5 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const SectionFinale = forwardRef<HTMLElement, SectionFinaleProps>(
  function SectionFinale({ timelines }, ref) {
    const stickyRef = useRef<HTMLDivElement>(null);

    useGSAP(
      () => {
        const sticky = stickyRef.current;
        if (!timelines || !sticky) return;
        const { finale } = timelines;

        const eyebrow = sticky.querySelector("[data-fin-eyebrow]");
        if (eyebrow) {
          finale.fromTo(
            eyebrow,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            FINALE.headline - 0.25,
          );
        }

        const headline = sticky.querySelector("[data-fin-headline]");
        let split: SplitText | null = null;
        if (headline) {
          split = SplitText.create(headline, { type: "chars", mask: "chars" });
          gsap.set(headline, { visibility: "visible" });
          finale.fromTo(
            split.chars,
            { yPercent: 120 },
            {
              yPercent: 0,
              duration: 0.6,
              stagger: 0.035,
              ease: "power4.out",
            },
            FINALE.headline,
          );
        }

        const socials = sticky.querySelectorAll("[data-fin-social]");
        finale.fromTo(
          socials,
          { opacity: 0, y: 40, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.6)",
          },
          FINALE.socials,
        );

        const credits = sticky.querySelectorAll("[data-fin-credit]");
        finale.fromTo(
          credits,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.14,
            ease: "power2.out",
          },
          FINALE.credits,
        );

        return () => {
          if (split) split.revert();
        };
      },
      { scope: stickyRef, dependencies: [timelines] },
    );

    return (
      <section
        ref={ref}
        style={{ position: "relative", height: "450vh", zIndex: 1 }}
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
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "13vh",
              gap: "2rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p
                data-fin-eyebrow
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  color: "#8fa3c4",
                  marginBottom: "1.2rem",
                  opacity: 0,
                }}
              >
                Obrigado por voar até aqui
              </p>
              <h2
                data-fin-headline
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  fontSize: "clamp(3.4rem, 10.5vw, 10rem)",
                  lineHeight: 1,
                  color: "#f4f4f6",
                  filter: "drop-shadow(0 0 30px rgba(160, 190, 255, 0.28))",
                  visibility: "hidden",
                }}
              >
                #TeDáAsas
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1.1rem",
                pointerEvents: "auto",
              }}
            >
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  data-fin-social
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      y: -8,
                      scale: 1.08,
                      backgroundColor: "rgba(226, 27, 77, 0.92)",
                      borderColor: "rgba(226, 27, 77, 0.9)",
                      duration: 0.3,
                      ease: "power2.out",
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      y: 0,
                      scale: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      borderColor: "rgba(255, 255, 255, 0.16)",
                      duration: 0.35,
                      ease: "power2.out",
                    });
                  }}
                  style={{
                    width: "62px",
                    height: "62px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1.5px solid rgba(255, 255, 255, 0.16)",
                    backdropFilter: "blur(6px)",
                    color: "#f4f4f6",
                    opacity: 0,
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "4.4vh",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "3rem",
              padding: "0 5vw",
            }}
          >
            <div style={{ maxWidth: "300px" }}>
              <p
                data-fin-credit
                style={{
                  fontSize: "0.92rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#c7d2e4",
                  opacity: 0,
                }}
              >
                Desenvolvido por{" "}
                <span style={{ color: "#f4f4f6", fontWeight: 600 }}>
                  Guilherme Neves
                </span>
              </p>
              <div
                data-fin-credit
                style={{
                  width: "52px",
                  height: "3px",
                  borderRadius: "999px",
                  background: "#e21b4d",
                  marginTop: "0.9rem",
                  opacity: 0,
                }}
              />
            </div>

            <p
              data-fin-credit
              style={{
                maxWidth: "400px",
                textAlign: "right",
                fontSize: "0.72rem",
                lineHeight: 1.65,
                letterSpacing: "0.04em",
                color: "rgba(143, 163, 196, 0.75)",
                opacity: 0,
              }}
            >
              Projeto fan made, criado apenas para fins de estudo e portfólio,
              sem fins comerciais. Este site não é afiliado, endossado ou
              patrocinado pela Red Bull GmbH. Red Bull, seu logotipo e todas as
              marcas relacionadas pertencem aos seus respectivos proprietários.
              Vídeos e imagens são utilizados somente como demonstração.
            </p>
          </div>
        </div>
      </section>
    );
  },
);

export default SectionFinale;
