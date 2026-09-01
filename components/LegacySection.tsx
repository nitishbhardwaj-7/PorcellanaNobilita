"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  leftImage?: string;
  leftLabel?: string;
  sketchImage?: string;
  logoImage?: string;
  taglineImage?: string;
  rightImage?: string;
  rightLabel?: string;
}

export default function LegacySection({
  leftImage,
  leftLabel,
  sketchImage,
  logoImage,
  taglineImage,
  rightImage,
  rightLabel,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const imgLeftRef = useRef<HTMLImageElement>(null);
  const imgRightRef = useRef<HTMLImageElement>(null);
  const labelTreviRef = useRef<HTMLParagraphElement>(null);
  const labelPalazzoRef = useRef<HTMLParagraphElement>(null);
  const sketchRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const panelLeft = panelLeftRef.current;
      const panelRight = panelRightRef.current;
      const imgLeft = imgLeftRef.current;
      const imgRight = imgRightRef.current;
      const labelTrevi = labelTreviRef.current;
      const labelPalazzo = labelPalazzoRef.current;
      const sketch = sketchRef.current;
      const logo = logoRef.current;
      const tagline = taglineRef.current;

      if (!section || !panelLeft || !panelRight || !imgLeft || !imgRight ||
        !labelTrevi || !labelPalazzo || !sketch || !logo || !tagline) return;

      // ── SET ALL INITIAL (HIDDEN) STATES ─────────────────────────────────────
      gsap.set(panelLeft, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(panelRight, { clipPath: "inset(0 0 0 100%)" });
      gsap.set(sketch, { opacity: 0 });
      gsap.set(labelTrevi, { opacity: 0, x: -28 });
      gsap.set(labelPalazzo, { opacity: 0, x: 28 });
      gsap.set(logo, { opacity: 0, scale: 0.92 });
      gsap.set(tagline, { opacity: 0 });

      // ── MAIN TIMELINE ────────────────────────────────────────────────────────
      const tl = gsap.timeline({
        delay: 0.5,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      // 1. Both panels clip-wipe open simultaneously
      tl.to(panelLeft, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.4,
        ease: "power3.inOut",
      })
        .to(panelRight, {
          clipPath: "inset(0 0 0 0%)",
          duration: 1.4,
          ease: "power3.inOut",
        }, "<")

        // 4. Sketch slow light-fade (starts 0.3s after panels)
        .to(sketch, {
          opacity: 1,
          duration: 1.8,
          ease: "power1.inOut",
        }, "<0.3")

        // 3. Labels slide in from outer edges
        .to(labelTrevi, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
        }, "-=0.4")
        .to(labelPalazzo, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
        }, "<")

        // 5. PORCELLANA char snap stagger
        .to(".triptych-char", {
          opacity: 1,
          duration: 0.01,
          stagger: 0.045,
          ease: "none",
        }, "-=0.8")

        // 6. Logo scale up
        .to(logo, {
          opacity: 1,
          scale: 1,
          duration: 1.0,
          ease: "power3.out",
        }, "-=0.2")

        // 7. Tagline fade
        .to(tagline, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.3");

      // ── 2. PARALLAX — opposite directions ───────────────────────────────────
      gsap.to(imgLeft, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      gsap.to(imgRight, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="triptych-section w-full min-h-screen flex flex-col md:flex-row bg-white"
    >
      {/* ── LEFT PANEL — Trevi Fountain */}
      <div
        ref={panelLeftRef}
        className="panel-left relative w-full md:w-1/3 h-[50vh] md:h-screen overflow-hidden"
      >
        <img
          ref={imgLeftRef}
          src={leftImage || "/images/Links/Trevi-Fountain-Large.jpeg"}
          alt="Trevi Fountain"
          loading="lazy"
          className="panel-img absolute inset-0 w-full h-[112%] object-cover"
          style={{ top: "-6%" }}
        />

        <div className="absolute bottom-8 left-0 right-0 text-center z-10">
          <p
            ref={labelTreviRef}
            className="label-trevi font-ivymode tracking-[0.20em] text-[clamp(11px,1.2vw,16px)] text-white uppercase inline-block"
          >
            {leftLabel || "TREVI FOUNTAIN"}
          </p>
        </div>
      </div>

      {/* ── CENTER PANEL */}
      <div className="w-full md:w-1/3 mb-10 md:mb-0 lg:mb-0 md:py-0 md:min-h-0 md:h-screen bg-white flex flex-col items-center justify-center md:justify-end relative px-6">
        <div className="w-full md:flex-1 flex flex-col items-center justify-center md:justify-end max-w-none px-4 space-y-6 md:space-y-0">
          <img
            ref={sketchRef}
            src={sketchImage || "/images/Links/DP8017299.png"}
            alt="Palazzo architectural sketch"
            loading="lazy"
            className="sketch-img w-[80%] mt-10 md:mt-0 lg:mt-0 sm:w-[70%] md:w-[85%] lg:w-[95%] max-w-[340px] md:max-w-[360px] h-auto object-contain"
          />

          <div className="hidden md:block flex-grow max-h-10" />

          <img
            ref={logoRef}
            src={logoImage || "/images/Links/NOBILITA Logo BLACK.png"}
            alt="Nobilita Logo"
            loading="lazy"
            className="nobilita-logo h-12 md:h-22 lg:h-24 w-[280px] object-contain"
          />

          <div className="hidden md:block flex-grow max-h-10" />

          <img
            ref={taglineRef}
            src={taglineImage || "/images/Links/tag grey.png"}
            alt="Il Gres Imperiale d'Italia"
            loading="lazy"
            className="tagline-text w-[80%] sm:w-[70%] md:w-[85%] lg:w-[95%] max-w-[340px] md:max-w-[360px] h-auto object-contain"
          />

          <div className="hidden md:block flex-grow max-h-12" />
        </div>
      </div>

      {/* ── RIGHT PANEL — Palazzo della Civiltà Italiana */}
      <div
        ref={panelRightRef}
        className="panel-right relative w-full md:w-1/3 h-[50vh] md:h-screen overflow-hidden"
      >
        <img
          ref={imgRightRef}
          src={rightImage || "/images/rightlegacy.jpg"}
          alt="Palazzo della Civiltà Italiana"
          loading="lazy"
          className="panel-img absolute inset-0 w-full h-[112%] object-cover"
          style={{ top: "-6%" }}
        />

        <div className="absolute bottom-8 left-0 right-0 text-center z-10">
          <p
            ref={labelPalazzoRef}
            className="label-palazzo font-ivymode tracking-[0.15em] text-[clamp(11px,1.2vw,16px)] text-white uppercase inline-block"
          >
            {rightLabel || "PALAZZO DELLA CIVILTÀ ITALIANA"}
          </p>
        </div>
      </div>
    </section>
  );
}
