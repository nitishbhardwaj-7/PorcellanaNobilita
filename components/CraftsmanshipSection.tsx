"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";


gsap.registerPlugin(ScrollTrigger);

export default function CraftsmanshipSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const badgeWrapRef = useRef<HTMLButtonElement>(null);
  const badgeTextRef = useRef<HTMLSpanElement>(null);
  const borderTopRef = useRef<HTMLDivElement>(null);
  const borderBotRef = useRef<HTMLDivElement>(null);
  const borderLeftRef = useRef<HTMLDivElement>(null);
  const borderRightRef = useRef<HTMLDivElement>(null);
  const casaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const para = paraRef.current;
    const badgeWrap = badgeWrapRef.current;
    const badgeText = badgeTextRef.current;
    const borderTop = borderTopRef.current;
    const borderBot = borderBotRef.current;
    const borderLeft = borderLeftRef.current;
    const borderRight = borderRightRef.current;
    const casa = casaRef.current;

    if (!section || !heading || !para || !badgeWrap || !badgeText ||
      !borderTop || !borderBot || !borderLeft || !borderRight || !casa) return;

    // ── 2. HEADING — LETTER SPACING COMPRESS ON ENTER ─────────────────────────
    gsap.fromTo(heading,
      { opacity: 0, letterSpacing: "0.28em", marginRight: "-0.28em" },
      {
        opacity: 1,
        letterSpacing: "0.15em",
        marginRight: "-0.15em",
        duration: 1.6,
        delay: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      }
    );

    // ── 3. BODY PARAGRAPH — WORD-BY-WORD OPACITY SNAP ─────────────────────────
    const rawText = para.innerText;
    const words = rawText.split(" ");
    para.innerHTML = words
      .map(w => `<span class="craftsmanship-word" style="display:inline-block;opacity:0;">${w}</span> `)
      .join("");

    gsap.to(".craftsmanship-word", {
      opacity: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: "power2.out",
      delay: 1.4,
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        once: true,
      },
    });

    // ── 4. BADGE — BORDER DRAWS THEN TEXT APPEARS ─────────────────────────────
    // Set initial states
    gsap.set([borderTop, borderBot], { width: "0%", left: "50%", xPercent: -50 });
    gsap.set([borderLeft, borderRight], { height: "0%", top: "50%", yPercent: -50 });
    gsap.set(badgeText, { opacity: 0 });

    const tl = gsap.timeline({
      delay: 0.5,
      scrollTrigger: {
        trigger: badgeWrap,
        start: "top 78%",
        once: true,
      },
    });

    // Top and bottom grow outward from center
    tl.to([borderTop, borderBot], {
      width: "100%",
      left: "0%",
      xPercent: 0,
      duration: 0.6,
      ease: "power2.inOut",
    })
      // Left and right grow from center — overlaps slightly
      .to([borderLeft, borderRight], {
        height: "100%",
        top: "0%",
        yPercent: 0,
        duration: 0.4,
        ease: "power2.inOut",
      }, "-=0.3")
      // Text snaps in last
      .to(badgeText, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.1");

    // ── 5. CASA NOBILE — DELAYED LETTER SPACING COMPRESS ──────────────────────
    gsap.fromTo(casa,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.0,
        delay: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          once: true,
        },
      }
    );

    // Cleanup all ScrollTriggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="made-in-italy"
      className="craftsmanship-section relative w-full min-h-screen flex flex-col justify-between pt-16 pb-8 md:py-16 px-6 md:px-16 overflow-hidden"
    >
      {/* ── BACKGROUND IMAGE — responsive full-cover */}
      <div className="absolute inset-0">
        <picture className="w-full h-full block">
          <source
            media="(max-width: 767px)"
            srcSet="/images/Links/medici-villa-mobile.png"
          />
          <img
            src="/images/Links/MEDICI VILLA copy (7).png"
            alt="Italian craftsmanship"
            loading="lazy"
            className="w-full h-full object-cover object-center block"
          />
        </picture>
      </div>
      {/* Subtle black overlay to make the text pop */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* ── TOP HEADING & PARAGRAPH GROUP ── */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto pt-0 flex flex-col items-center px-4">
        <div className="w-auto max-w-full md:w-min flex flex-col items-center">
          <h2
            ref={headingRef}
            className="craftsmanship-heading font-ivymode text-white font-light text-[clamp(28px,6.5vw,66px)] md:text-[clamp(28px,4.5vw,66px)] uppercase text-center whitespace-normal md:whitespace-nowrap leading-tight py-1"
            style={{ opacity: 0, letterSpacing: "0.28em", marginRight: "-0.28em" }}
          >
            ITALIAN CRAFTSMANSHIP
          </h2>
          <p
            ref={paraRef}
            className="craftsmanship-para font-ivymode font-extralight text-white text-center md:text-justify md:[text-align-last:center] text-[14px] sm:text-[15px] md:text-[18px] tracking-widest leading-[28px] md:leading-[32px] w-full mt-3"
          >
            In the heart of Modena, where centuries of Italian expertise meet innovation, NOBILITA creates porcelain surfaces that embody the art of timeless craftsmanship.
          </p>
        </div>
      </div>

      {/* ── LOWER-CENTER BADGE ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-auto mb-6 md:mb-14 px-6 w-full">
        {/* ── MADE IN ITALY BADGE */}
        <Link href="/made-in-italy">
          <button
            ref={badgeWrapRef}
            className="badge-wrap group relative overflow-hidden inline-block bg-transparent cursor-pointer focus:outline-none px-8 py-2.5"
          >
            {/* White fill — slides in from left on hover */}
            <span className="absolute -inset-[1px] bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />

            {/* Four border line elements */}
            <div
              ref={borderTopRef}
              className="badge-border-top absolute top-0 left-1/2 -translate-x-1/2 h-px bg-white"
              style={{ width: "0%" }}
            />
            <div
              ref={borderBotRef}
              className="badge-border-bottom absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-white"
              style={{ width: "0%" }}
            />
            <div
              ref={borderLeftRef}
              className="badge-border-left absolute left-0 top-1/2 -translate-y-1/2 w-px bg-white"
              style={{ height: "0%" }}
            />
            <div
              ref={borderRightRef}
              className="badge-border-right absolute right-0 top-1/2 -translate-y-1/2 w-px bg-white"
              style={{ height: "0%" }}
            />

            <span
              ref={badgeTextRef}
              className="badge-text relative z-10 font-michroma text-white group-hover:text-black transition-colors duration-500 text-[clamp(12px,1.5vw,20px)] tracking-[0.25em] uppercase"
              style={{ opacity: 0 }}
            >
              MADE IN ITALY
            </span>
          </button>
        </Link>
      </div>

      {/* ── BOTTOM: CASA NOBILE */}
      <div className="absolute bottom-4 right-4 md:bottom-2 md:right-3 z-10">
        <span
          ref={casaRef}
          className="casa-nobile-label font-ivymode text-white/90 text-[16px] tracking-[0.2em] uppercase"
          style={{ opacity: 0, letterSpacing: "0.1em" }}
        >
          CASA NOBILE
        </span>
      </div>
    </section>
  );
}
