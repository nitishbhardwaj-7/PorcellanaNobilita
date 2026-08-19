"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function DimensionsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Reveal the main title (slow slide-up reveal from overflow hidden)
      gsap.fromTo(
        ".dimensions-title-span",
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 2.0,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".dimensions-title-span",
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Reveal the specification grid with a deliberate startup delay and slower stagger
      const grid = section.querySelector(".dimensions-grid");
      if (grid) {
        const tl = gsap.timeline({
          delay: 0.5, // Deliberate delay before starting grid reveal
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        // Stagger column headers slowly
        tl.fromTo(
          ".dimensions-col-header",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.6, stagger: 0.2, ease: "power4.out" }
        );

        // Stagger details items slowly
        tl.fromTo(
          ".dimensions-col-item",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.8"
        );
      }

      // 3. Image curtain wipe-reveal (slow & dramatic) and smooth scroll parallax
      const imageContainer = section.querySelector(".dimensions-img-container");
      const img = section.querySelector(".dimensions-img");
      const btn = section.querySelector(".dimensions-btn");

      if (imageContainer && img) {
        // Smooth, slow clip-path curtain reveal
        gsap.fromTo(
          imageContainer,
          { clipPath: "inset(0% 12% 0% 12%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 2.4,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: imageContainer,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // Centered button reveal with slow delay
        if (btn) {
          gsap.fromTo(
            btn,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.6,
              delay: 0.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: imageContainer,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white flex flex-col items-center">
      {/* Title - slide up reveal */}
      <div className="w-full px-4 mb-[40px] text-center overflow-hidden">
        <h2 className="font-ivymode text-[clamp(28px,6.5vw,66px)] md:text-[clamp(28px,4.5vw,66px)] text-[#545759] tracking-[0.06em] md:tracking-[0.1em] uppercase inline-block">
          <span className="dimensions-title-span inline-block">
            FORMAT & DIMENSIONS
          </span>
        </h2>
      </div>

      {/* Specification Grid with stagger */}
      <div className="dimensions-grid w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 mb-12 md:mb-16">
        {/* Column 1: THICKNESS */}
        <div className="dimensions-col flex flex-col items-center text-center space-y-[15px] md:space-y-[15px]">
          <h3
            className="dimensions-col-header font-didotbold tracking-[0.15em] text-[#545759] uppercase text-[clamp(20px,2.5vw,28px)] opacity-0"
            style={{ fontFamily: "var(--font-didotbold), Georgia, serif" }}
          >
            THICKNESS
          </h3>
          <div className="font-michroma font-light text-[#545759] space-y-[15px] md:space-y-[15px] uppercase tracking-wider text-[clamp(16px,2vw,22px)]">
            <p className="dimensions-col-item opacity-0">6.5 MM</p>
            <p className="dimensions-col-item opacity-0">12 MM</p>
          </div>
        </div>

        {/* Column 2: DIMENSIONS */}
        <div className="dimensions-col flex flex-col items-center text-center space-y-[15px] md:space-y-[15px]">
          <h3
            className="dimensions-col-header font-didotbold tracking-[0.15em] text-[#545759] uppercase text-[clamp(20px,2.5vw,28px)] opacity-0"
            style={{ fontFamily: "var(--font-didotbold), Georgia, serif" }}
          >
            DIMENSIONS
          </h3>
          <div className="font-michroma font-light text-[#545759] space-y-[15px] md:space-y-[15px] uppercase tracking-wider text-[clamp(16px,2vw,22px)]">
            <p className="dimensions-col-item opacity-0">1600 X 3200 MM</p>
            <p className="dimensions-col-item opacity-0">1620 X 3240 MM</p>
          </div>
        </div>

        {/* Column 3: FORMAT */}
        <div className="dimensions-col flex flex-col items-center text-center space-y-[15px] md:space-y-[15px]">
          <h3
            className="dimensions-col-header font-didotbold tracking-[0.15em] text-[#545759] uppercase text-[clamp(20px,2.5vw,28px)] opacity-0"
            style={{ fontFamily: "var(--font-didotbold)" }}
          >
            FORMAT
          </h3>
          <div className="font-michroma font-light text-[#545759] space-y-[15px] md:space-y-[15px] uppercase tracking-wider text-[clamp(16px,2vw,22px)]">
            <p className="dimensions-col-item opacity-0">RECTIFIED</p>
            <p className="dimensions-col-item opacity-0">GROSS</p>
          </div>
        </div>
      </div>

      {/* Feature Image with Centered Button */}
      <div className="relative w-full px-0 flex justify-center items-center overflow-hidden">
        <div
          className="dimensions-img-container relative w-full h-[300px] md:h-[450px] overflow-hidden flex justify-center items-center"
          style={{ clipPath: "inset(0% 12% 0% 12%)", opacity: 0 }}
        >
          <img
            src="/images/format & dimensions application copy new.jpg"
            alt="Format and Dimensions"
            loading="lazy"
            className="dimensions-img absolute inset-0 w-full h-full object-cover"
          />
          <Link href="/technical-data" className="absolute z-10">
            <button
              className="dimensions-btn relative overflow-hidden border border-white text-white bg-transparent px-8 py-2.5 font-michroma text-[clamp(12px,1.5vw,20px)] tracking-[0.25em] transition-colors duration-500 uppercase group opacity-0"
            >
              <span className="absolute -inset-[1px] bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                TECHNICAL DATA
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
