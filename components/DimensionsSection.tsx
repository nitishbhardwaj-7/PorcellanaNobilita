"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { colorClass, fontClass, headingSizeClass, paragraphSizeClass } from "@/lib/textStyle";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  heading?: string;
  headingColor?: string;
  headingFont?: string;
  headingSize?: string;
  col1Header?: string;
  col1HeaderColor?: string | null;
  col1HeaderFont?: string | null;
  col1HeaderSize?: string | null;
  col1Item1?: string;
  col1Item1Color?: string | null;
  col1Item1Font?: string | null;
  col1Item1Size?: string | null;
  col1Item2?: string;
  col1Item2Color?: string | null;
  col1Item2Font?: string | null;
  col1Item2Size?: string | null;
  col2Header?: string;
  col2HeaderColor?: string | null;
  col2HeaderFont?: string | null;
  col2HeaderSize?: string | null;
  col2Item1?: string;
  col2Item1Color?: string | null;
  col2Item1Font?: string | null;
  col2Item1Size?: string | null;
  col2Item2?: string;
  col2Item2Color?: string | null;
  col2Item2Font?: string | null;
  col2Item2Size?: string | null;
  col3Header?: string;
  col3HeaderColor?: string | null;
  col3HeaderFont?: string | null;
  col3HeaderSize?: string | null;
  col3Item1?: string;
  col3Item1Color?: string | null;
  col3Item1Font?: string | null;
  col3Item1Size?: string | null;
  col3Item2?: string;
  col3Item2Color?: string | null;
  col3Item2Font?: string | null;
  col3Item2Size?: string | null;
  image?: string;
  btnText?: string;
  btnLink?: string;
}

export default function DimensionsSection({
  heading,
  headingColor,
  headingFont,
  headingSize,
  col1Header,
  col1HeaderColor,
  col1HeaderFont,
  col1HeaderSize,
  col1Item1,
  col1Item1Color,
  col1Item1Font,
  col1Item1Size,
  col1Item2,
  col1Item2Color,
  col1Item2Font,
  col1Item2Size,
  col2Header,
  col2HeaderColor,
  col2HeaderFont,
  col2HeaderSize,
  col2Item1,
  col2Item1Color,
  col2Item1Font,
  col2Item1Size,
  col2Item2,
  col2Item2Color,
  col2Item2Font,
  col2Item2Size,
  col3Header,
  col3HeaderColor,
  col3HeaderFont,
  col3HeaderSize,
  col3Item1,
  col3Item1Color,
  col3Item1Font,
  col3Item1Size,
  col3Item2,
  col3Item2Color,
  col3Item2Font,
  col3Item2Size,
  image,
  btnText,
  btnLink,
}: Props) {
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
        <h2 className={`${fontClass(headingFont, "font-ivymode")} ${headingSizeClass(headingSize, "text-[clamp(28px,6.5vw,66px)] md:text-[clamp(28px,4.5vw,66px)]")} ${colorClass(headingColor, "text-[#545759]")} tracking-[0.06em] md:tracking-[0.1em] uppercase inline-block`}>
          <span className="dimensions-title-span inline-block">
            {heading || "FORMAT & DIMENSIONS"}
          </span>
        </h2>
      </div>

      {/* Specification Grid with stagger */}
      <div className="dimensions-grid w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 mb-12 md:mb-16">
        {/* Column 1: THICKNESS */}
        <div className="dimensions-col flex flex-col items-center text-center space-y-[15px] md:space-y-[15px]">
          <h3
            className={`dimensions-col-header ${fontClass(col1HeaderFont, "font-didotbold")} tracking-[0.15em] ${colorClass(col1HeaderColor, "text-[#545759]")} uppercase ${headingSizeClass(col1HeaderSize, "text-[clamp(20px,2.5vw,28px)]")} opacity-0`}
          >
            {col1Header || "THICKNESS"}
          </h3>
          <div className="space-y-[15px] md:space-y-[15px] uppercase tracking-wider">
            <p className={`dimensions-col-item opacity-0 ${fontClass(col1Item1Font, "font-michroma")} font-light ${colorClass(col1Item1Color, "text-[#545759]")} ${paragraphSizeClass(col1Item1Size, "text-[clamp(16px,2vw,22px)]")}`}>{col1Item1 || "6.5 MM"}</p>
            <p className={`dimensions-col-item opacity-0 ${fontClass(col1Item2Font, "font-michroma")} font-light ${colorClass(col1Item2Color, "text-[#545759]")} ${paragraphSizeClass(col1Item2Size, "text-[clamp(16px,2vw,22px)]")}`}>{col1Item2 || "12 MM"}</p>
          </div>
        </div>

        {/* Column 2: DIMENSIONS */}
        <div className="dimensions-col flex flex-col items-center text-center space-y-[15px] md:space-y-[15px]">
          <h3
            className={`dimensions-col-header ${fontClass(col2HeaderFont, "font-didotbold")} tracking-[0.15em] ${colorClass(col2HeaderColor, "text-[#545759]")} uppercase ${headingSizeClass(col2HeaderSize, "text-[clamp(20px,2.5vw,28px)]")} opacity-0`}
          >
            {col2Header || "DIMENSIONS"}
          </h3>
          <div className="space-y-[15px] md:space-y-[15px] uppercase tracking-wider">
            <p className={`dimensions-col-item opacity-0 ${fontClass(col2Item1Font, "font-michroma")} font-light ${colorClass(col2Item1Color, "text-[#545759]")} ${paragraphSizeClass(col2Item1Size, "text-[clamp(16px,2vw,22px)]")}`}>{col2Item1 || "1600 X 3200 MM"}</p>
            <p className={`dimensions-col-item opacity-0 ${fontClass(col2Item2Font, "font-michroma")} font-light ${colorClass(col2Item2Color, "text-[#545759]")} ${paragraphSizeClass(col2Item2Size, "text-[clamp(16px,2vw,22px)]")}`}>{col2Item2 || "1620 X 3240 MM"}</p>
          </div>
        </div>

        {/* Column 3: FORMAT */}
        <div className="dimensions-col flex flex-col items-center text-center space-y-[15px] md:space-y-[15px]">
          <h3
            className={`dimensions-col-header ${fontClass(col3HeaderFont, "font-didotbold")} tracking-[0.15em] ${colorClass(col3HeaderColor, "text-[#545759]")} uppercase ${headingSizeClass(col3HeaderSize, "text-[clamp(20px,2.5vw,28px)]")} opacity-0`}
          >
            {col3Header || "FORMAT"}
          </h3>
          <div className="space-y-[15px] md:space-y-[15px] uppercase tracking-wider">
            <p className={`dimensions-col-item opacity-0 ${fontClass(col3Item1Font, "font-michroma")} font-light ${colorClass(col3Item1Color, "text-[#545759]")} ${paragraphSizeClass(col3Item1Size, "text-[clamp(16px,2vw,22px)]")}`}>{col3Item1 || "RECTIFIED"}</p>
            <p className={`dimensions-col-item opacity-0 ${fontClass(col3Item2Font, "font-michroma")} font-light ${colorClass(col3Item2Color, "text-[#545759]")} ${paragraphSizeClass(col3Item2Size, "text-[clamp(16px,2vw,22px)]")}`}>{col3Item2 || "GROSS"}</p>
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
            src={image || "/images/format & dimensions application copy new.jpg"}
            alt="Format and Dimensions"
            loading="lazy"
            className="dimensions-img absolute inset-0 w-full h-full object-cover"
          />
          <Link href={btnLink || "/technical-data"} className="absolute z-10">
            <button
              className="dimensions-btn relative overflow-hidden border border-white text-white bg-transparent px-8 py-2.5 font-michroma text-[clamp(12px,1.5vw,20px)] tracking-[0.25em] transition-colors duration-500 uppercase group opacity-0"
            >
              <span className="absolute -inset-[1px] bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                {btnText || "TECHNICAL DATA"}
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
