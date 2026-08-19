"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const applications = [
  { name: "INTERIOR WALLS", image: "/images/Calacatta Oyster Application 1.jpg", row: 1 },
  { name: "INTERIOR FLOORS", image: "/images/ccc.jpg", row: 1 },
  { name: "COUNTERTOPS", image: "/images/mmm.jpg", row: 1 },
  { name: "EXTERIOR WALLS", image: "/images/22.png", row: 2 },
  { name: "EXTERIOR FLOORS", image: "/images/4.jpg", row: 2 },
  { name: "FURNITURE", image: "/images/Arabescato Fjord (2).jpg", row: 2 },
];

const DARK_LABEL = ["EXTERIOR WALLS", "EXTERIOR FLOORS", "FURNITURE"];

const appProductMapping: Record<string, string> = {
  "INTERIOR WALLS": "Calacatta Oyster",
  "INTERIOR FLOORS": "Verde Profondo",
  "COUNTERTOPS": "Macchia Vecchia Max",
  "EXTERIOR WALLS": "Arabescato Fjord",
  "EXTERIOR FLOORS": "Travertino Romano Classico Vein Cut",
  "FURNITURE": "Arabescato Fjord",
};

interface ApplicationsSectionProps {
  onTileClick?: (productName: string) => void;
}

export default function ApplicationsSection({ onTileClick }: ApplicationsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cleanupFns: (() => void)[] = [];
    const ctx = gsap.context(() => {
      const heading = headingRef.current;
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;

      if (!heading || !row1 || !row2) return;

      // ── 1. HEADING — slow slide-up reveal from overflow hidden ──────────────────────────────
      const headingSpan = heading.querySelector(".applications-title-span");
      if (headingSpan) {
        gsap.fromTo(
          headingSpan,
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 2.0,
            delay: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingSpan,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // ── 2. ROW 1 TILES — clip wipe bottom→top, staggered ─────────────────
      const row1Tiles = row1.querySelectorAll<HTMLElement>(".app-tile");
      gsap.set(row1Tiles, { clipPath: "inset(0 0 100% 0)" });
      gsap.to(row1Tiles, {
        clipPath: "inset(0 0 0% 0)",
        duration: 1.1,
        delay: 0.5,
        ease: "power3.inOut",
        stagger: 0.1,
        scrollTrigger: {
          trigger: row1,
          start: "top 82%",
          once: true,
        },
      });

      // ── 2. ROW 2 TILES — same, fires slightly later ───────────────────────
      const row2Tiles = row2.querySelectorAll<HTMLElement>(".app-tile");
      gsap.set(row2Tiles, { clipPath: "inset(0 0 100% 0)" });
      gsap.to(row2Tiles, {
        clipPath: "inset(0 0 0% 0)",
        duration: 1.1,
        delay: 0.5,
        ease: "power3.inOut",
        stagger: 0.1,
        scrollTrigger: {
          trigger: row2,
          start: "top 85%",
          once: true,
        },
      });

      // ── 3. LABELS — slide up after tiles reveal ───────────────────────────
      const allLabels = document.querySelectorAll<HTMLElement>(".tile-label");
      gsap.set(allLabels, { opacity: 0, y: 10 });
      gsap.to(allLabels, {
        opacity: 0.85,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: { each: 0.1, from: "start" },
        delay: 1.1,
        scrollTrigger: {
          trigger: row1,
          start: "top 75%",
          once: true,
        },
      });

      // ── 4 & 5. HOVER — image parallax + zoom out + label letter-spacing ─────────────
      tileRefs.current.forEach((tile) => {
        if (!tile) return;
        const img = tile.querySelector<HTMLElement>(".tile-img");
        const label = tile.querySelector<HTMLElement>(".tile-label");
        if (!img || !label) return;

        // Set initial scale to 1.18
        gsap.set(img, { scale: 1.18 });

        const onMouseEnter = () => {
          gsap.to(img, { scale: 1.08, duration: 0.8, ease: "power2.out", overwrite: "auto", delay: 0.1 });
          gsap.to(label, { letterSpacing: "0.18em", opacity: 1, duration: 0.5, ease: "power2.out" });
        };

        const onMouseLeave = () => {
          gsap.to(img, { scale: 1.18, duration: 1.2, ease: "power3.out", overwrite: "auto", delay: 0.1 });
          gsap.to(label, { letterSpacing: "0.1em", opacity: 0.85, duration: 0.5, ease: "power2.out" });
        };

        tile.addEventListener("mouseenter", onMouseEnter);
        tile.addEventListener("mouseleave", onMouseLeave);

        cleanupFns.push(() => {
          tile.removeEventListener("mouseenter", onMouseEnter);
          tile.removeEventListener("mouseleave", onMouseLeave);
        });
      });
    });

    return () => {
      ctx.revert();
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  const row1Apps = applications.filter(a => a.row === 1);
  const row2Apps = applications.filter(a => a.row === 2);

  const renderTile = (app: typeof applications[0], globalIdx: number) => {
    const productName = appProductMapping[app.name];
    return (
      <div
        key={app.name}
        ref={el => { tileRefs.current[globalIdx] = el; }}
        onClick={() => {
          if (productName && onTileClick) {
            onTileClick(productName);
          }
        }}
        className="app-tile group relative overflow-hidden cursor-pointer h-[250px] md:h-[300px] lg:h-[360px]"
      >
        <img
          src={app.image}
          alt={app.name}
          className="tile-img absolute inset-0 w-full h-full object-cover"
          style={{
            willChange: "transform",
            transform: "scale(1.18)",
          }}
        />
        {/* ── Label */}
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center pointer-events-none">
          <span
            className={`tile-label font-didot font-medium text-[clamp(16px,4vw,28px)] uppercase relative z-10 ${DARK_LABEL.includes(app.name) ? "text-brand-dark" : "text-white"
              }`}
            style={{ fontFamily: "var(--font-didot), Georgia, serif", letterSpacing: "0.1em", opacity: 0 }}
          >
            {app.name}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="applications-section w-full bg-white flex flex-col pb-[40px]"
    >
      {/* ── HEADING */}
      <div className="w-full px-4 mb-[40px] mt-[40px] text-center overflow-hidden">
        <h2
          ref={headingRef}
          className="applications-heading font-ivymode text-[clamp(28px,6.5vw,66px)] md:text-[clamp(28px,4.5vw,66px)] text-[#545759] tracking-[0.06em] md:tracking-[0.1em] uppercase inline-block"
        >
          <span className="applications-title-span inline-block">
            APPLICATIONS
          </span>
        </h2>
      </div>

      {/* ── GRID */}
      <div className="applications-grid flex-1 w-full px-4 md:px-10 flex flex-col gap-3">
        {/* Row 1 — grid gives equal widths */}
        <div
          ref={row1Ref}
          className="app-tile-row-1 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {row1Apps.map((app, i) => renderTile(app, i))}
        </div>

        {/* Row 2 */}
        <div
          ref={row2Ref}
          className="app-tile-row-2 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {row2Apps.map((app, i) => renderTile(app, i + 3))}
        </div>
      </div>
    </section>
  );
}
