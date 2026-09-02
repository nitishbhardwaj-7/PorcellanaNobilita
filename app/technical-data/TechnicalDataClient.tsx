"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSpillAnimations } from "@/hooks/useSpillAnimations";
import OilSpillSVG from "@/components/OilSpillSVG";
import CoffeeSpillSVG from "@/components/CoffeeSpillSVG";
import WineSpillSVG from "@/components/WineSpillSVG";

gsap.registerPlugin(ScrollTrigger);

interface TdCmsData {
  tdHeading?: string | null;
  tdHeroDesc?: string | null;
  tdCharHeading?: string | null;
  tdChar1Title?: string | null; tdChar1Desc?: string | null; tdChar1Icon?: string | null;
  tdChar2Title?: string | null; tdChar2Desc?: string | null; tdChar2Icon?: string | null;
  tdChar3Title?: string | null; tdChar3Desc?: string | null; tdChar3Icon?: string | null;
  tdChar4Title?: string | null; tdChar4Desc?: string | null; tdChar4Icon?: string | null;
  tdChar5Title?: string | null; tdChar5Desc?: string | null; tdChar5Icon?: string | null;
  tdChar6Title?: string | null; tdChar6Desc?: string | null; tdChar6Icon?: string | null;
  tdChar7Title?: string | null; tdChar7Desc?: string | null; tdChar7Icon?: string | null;
  tdChar8Title?: string | null; tdChar8Desc?: string | null; tdChar8Icon?: string | null;
  tdChar9Title?: string | null; tdChar9Desc?: string | null; tdChar9Icon?: string | null;
  tdUgHeading?: string | null;
  tdUgDesc1?: string | null;
  tdUgDesc2?: string | null;
  tdDimHeading?: string | null;
  tdDimDesc1?: string | null;
  tdDimDesc2?: string | null;
  tdDimDesc3?: string | null;
  tdThickHeading?: string | null;
  tdThickDesc1?: string | null;
  tdThickDesc2?: string | null;
  tdSpecsHeading?: string | null;
}

export default function TechnicalDataPage({ cmsData }: { cmsData?: TdCmsData | null }) {
  const d = cmsData || {};
  useSpillAnimations();
  const [dimSvg, setDimSvg] = useState<string>("");

  useEffect(() => {
    fetch("/images/technical%20data/SVGs/Artboard_13_cropped.svg?v=1.1")
      .then(r => r.text())
      .then(svg => setDimSvg(svg.replace(/<\?xml.*\?>/i, "")))
      .catch(err => console.error("Error loading dimension SVG:", err));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Reveal (Character Stagger)
      gsap.fromTo(".hero-title-char",
        { y: "120%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, stagger: 0.04, ease: "expo.out", delay: 0.2 }
      );

      // 1b. Hero Desc Word Stagger Animation
      const descElement = document.querySelector(".hero-desc");
      if (descElement && descElement.textContent) {
        const rawText = descElement.textContent;
        const words = rawText.split(" ");
        descElement.innerHTML = words
          .map(w => `<span class="hero-desc-word" style="display:inline-block;opacity:0;">${w}</span> `)
          .join("");

        gsap.to(".hero-desc-word", {
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.7,
        });
      }

      // 2. Characteristics Title Reveal (Character Stagger)
      gsap.fromTo(".char-title-char",
        { y: "120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.2,
          stagger: 0.04,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".char-title-trigger",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Characteristics Items Reveal (staggered)
      gsap.fromTo(".char-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".char-grid",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 3. User Guide Title Reveal (Character Stagger)
      gsap.fromTo(".ug-title-char",
        { y: "120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.2,
          stagger: 0.04,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".ug-title-trigger",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".ug-desc",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ug-title",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 3c. Dimensions Description Paragraphs (Silky Blur-Fade Reveal)
      gsap.fromTo(".dim-desc",
        { y: 25, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          stagger: 0.25,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".dim-desc-trigger",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 3d. Thicknesses Section Animations
      gsap.fromTo(".thick-title-char",
        { y: "120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.0,
          stagger: 0.03,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".thick-title-trigger",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".thick-desc",
        { y: 25, opacity: 0, filter: "blur(5px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power2.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: ".thick-text-trigger",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".thick-img-trigger",
        { x: 35, opacity: 0, filter: "blur(5px)" },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".thick-img-trigger",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 4. Technical Specs Reveal
      gsap.fromTo(".specs-title",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".specs-title",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".specs-btn",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".specs-title",
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Sync Dimension SVGs animation to trigger in sequence AFTER the title animates
  useEffect(() => {
    if (!dimSvg) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".dim-title-trigger",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // 1. Dimensions Title Reveal
      tl.fromTo(".dim-title-char",
        { y: "120%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.0, stagger: 0.03, ease: "expo.out" }
      );

      // 2. SVG reveal (fade-in, slide-up, silky blur-fade)
      tl.fromTo(".svg-inlined-container",
        { y: 55, opacity: 0, filter: "blur(5px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out" },
        "-=0.5" // Starts slightly before the title stagger completely ends
      );
    });

    return () => ctx.revert();
  }, [dimSvg]);

  return (
    <div className="min-h-screen bg-white text-brand-dark flex flex-col justify-between overflow-x-hidden relative">
      <Navbar />

      {/* Back Button Arrow */}
      <div className="absolute top-20 left-6 md:top-32 md:left-12 z-50">
        <Link
          href="/"
          className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/30 hover:border-white/70 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 focus:outline-none"
          aria-label="Go back to home"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 md:w-4.5 md:h-4.5 text-brand-dark/80 group-hover:text-brand-dark transition-transform duration-300 transform group-hover:-translate-x-0.5"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
      </div>

      {/* 1. Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col justify-start overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <video
            src="/images/technical data/engineered for perfomace.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-top opacity-100"
          />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-start pt-28 md:pt-20 px-6 md:px-12 mt-0 md:mt-12 text-center">

          <div className="w-full flex flex-col md:flex-row items-center justify-center relative px-4 md:px-20 gap-4 md:gap-0">
            <h1 className="font-ivymode font-light text-black uppercase tracking-[0.04em] md:tracking-[0.15em] text-[clamp(26px,5.5vw,52px)] md:text-[clamp(28px,4.5vw,52px)] leading-tight flex flex-wrap justify-center gap-x-[0.3em] md:gap-x-[0.4em] px-2 md:px-0">
              {(d.tdHeading || "ENGINEERED FOR PERFORMANCE").split(" ").map((word, wIdx) => (
                <span key={wIdx} className="inline-block whitespace-nowrap">
                  {word.split("").map((char, cIdx) => (
                    <span key={cIdx} className="inline-block overflow-hidden align-bottom py-2 md:py-0 px-[1px]">
                      <span className="hero-title-char inline-block">{char}</span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
          </div>
          <p
            className="hero-desc font-ivymode font-light text-black text-[15px] sm:text-[16px] md:text-[20px] tracking-wide max-w-[1150px] w-[92%] mx-auto mt-6 md:mt-10 text-justify"
            style={{ textAlignLast: "center" }}
          >
            {d.tdHeroDesc || "Every NOBILITA surface is engineered for exceptional performance from specification to installation. Designed by architects and engineers, it combines technical precision with refined aesthetics, ensuring premium quality, consistency and reliability. NOBILITA offers outstanding durability, dimensional stability, stain resistance, and long-term performance."}
          </p>
        </div>
      </section>

      {/* 2. Characteristics, User Guide & Technical Specifications Section */}
      <div className="bg-[#007190]">
        <section className="relative w-full pt-20 pb-0 md:pt-16 md:pb-0 px-6 md:px-12 lg:px-20 xl:px-24 bg-[#007190] text-white">
        <div className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto flex flex-col">

          {/* A. Characteristics Grid */}
          <div className="space-y-16">
            <div className="char-title char-title-trigger">
              <h2 className="font-ivymode font-light text-white uppercase tracking-[0.04em] md:tracking-[0.15em] text-[clamp(28px,6.5vw,52px)] md:text-[clamp(28px,4.5vw,52px)] leading-tight flex flex-wrap gap-x-[0.3em] md:gap-x-[0.4em]">
                {(d.tdCharHeading || "CHARACTERISTICS").split(" ").map((word, wIdx) => (
                  <span key={wIdx} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, cIdx) => (
                      <span key={cIdx} className="inline-block overflow-hidden align-bottom py-2 md:py-0 px-[1px]">
                        <span className="char-title-char inline-block">{char}</span>
                      </span>
                    ))}
                  </span>
                ))}
              </h2>
            </div>

            <div className="char-grid grid grid-cols-1 md:grid-cols-2 gap-x-16 md:gap-x-24 lg:gap-x-32 gap-y-10 md:gap-y-12">
              {/* WATER PROOF */}
              <div className="char-item flex items-start gap-6 md:gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <img
                    src={d.tdChar1Icon || "/images/technical data/SVGs/SVGs/icons-01.svg"}
                    alt="Water Proof"
                    className="w-full h-full object-contain scale-[2.2] transition-all duration-500 opacity-100 group-hover:opacity-100 group-hover:scale-[2.35]"
                  />
                </div>
                <div className="flex-1 space-y-2 md:space-y-4">
                  <h3 className="font-michroma text-base md:text-[18px] tracking-[0.15em] uppercase font-light text-white">
                    {d.tdChar1Title || "WATER PROOF"}
                  </h3>
                  <p className="font-ivymode font-light text-white/90 text-[14px] md:text-[18px] tracking-[0.08em] leading-normal">
                    {d.tdChar1Desc || "Highly resistant to water damage, due to an ultra-low absorption rate."}
                  </p>
                </div>
              </div>

              {/* UV RESISTANT */}
              <div className="char-item flex items-start gap-6 md:gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <img
                    src={d.tdChar2Icon || "/images/technical data/SVGs/SVGs/icons-06.svg"}
                    alt="UV Resistant"
                    className="w-full h-full object-contain scale-[2.2] transition-all duration-500 opacity-100 group-hover:opacity-100 group-hover:scale-[2.35]"
                  />
                </div>
                <div className="flex-1 space-y-2 md:space-y-4">
                  <h3 className="font-michroma text-base md:text-[18px] tracking-[0.15em] uppercase font-light text-white">
                    {d.tdChar2Title || "UV RESISTANT"}
                  </h3>
                  <p className="font-ivymode font-light text-white/90 text-[14px] md:text-[18px] tracking-[0.08em] leading-normal">
                    {d.tdChar2Desc || "Composed of 100% natural materials, ensuring colors remain vibrant even with prolonged exposure to sunlight and extreme weather."}
                  </p>
                </div>
              </div>

              {/* SCRATCH RESISTANT */}
              <div className="char-item flex items-start gap-6 md:gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <img
                    src={d.tdChar3Icon || "/images/technical data/SVGs/SVGs/icons-03.svg"}
                    alt="Scratch Resistant"
                    className="w-full h-full object-contain scale-[2.2] transition-all duration-500 opacity-100 group-hover:opacity-100 group-hover:scale-[2.35]"
                  />
                </div>
                <div className="flex-1 space-y-2 md:space-y-4">
                  <h3 className="font-michroma text-base md:text-[18px] tracking-[0.15em] uppercase font-light text-white">
                    {d.tdChar3Title || "SCRATCH RESISTANT"}
                  </h3>
                  <p className="font-ivymode font-light text-white/90 text-[14px] md:text-[18px] tracking-[0.08em] leading-normal">
                    {d.tdChar3Desc || "Engineered with a tough surface strength to withstand scratches and abrasions."}
                  </p>
                </div>
              </div>

              {/* ECO FRIENDLY */}
              <div className="char-item flex items-start gap-6 md:gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <img
                    src={d.tdChar4Icon || "/images/technical data/SVGs/SVGs/icons-04.svg"}
                    alt="Eco Friendly"
                    className="w-full h-full object-contain scale-[2.2] transition-all duration-500 opacity-100 group-hover:opacity-100 group-hover:scale-[2.35]"
                  />
                </div>
                <div className="flex-1 space-y-2 md:space-y-4">
                  <h3 className="font-michroma text-base md:text-[18px] tracking-[0.15em] uppercase font-light text-white">
                    {d.tdChar4Title || "ECO FRIENDLY"}
                  </h3>
                  <p className="font-ivymode font-light text-white/90 text-[14px] md:text-[18px] tracking-[0.08em] leading-normal">
                    {d.tdChar4Desc || "Contains no substances harmful to the environment."}
                  </p>
                </div>
              </div>

              {/* HEAT & FROST RESISTANT */}
              <div className="char-item flex items-start gap-6 md:gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <img
                    src={d.tdChar5Icon || "/images/technical data/SVGs/SVGs/icons-05.svg"}
                    alt="Heat & Frost Resistant"
                    className="w-full h-full object-contain scale-[2.2] transition-all duration-500 opacity-100 group-hover:opacity-100 group-hover:scale-[2.35]"
                  />
                </div>
                <div className="flex-1 space-y-2 md:space-y-4">
                  <h3 className="font-michroma text-base md:text-[18px] tracking-[0.15em] uppercase font-light text-white">
                    {d.tdChar5Title || "HEAT & FROST RESISTANT"}
                  </h3>
                  <p className="font-ivymode font-light text-white/90 text-[14px] md:text-[18px] tracking-[0.08em] leading-normal">
                    {d.tdChar5Desc || "NOBILITA does not burn, emit smoke, or release toxic substances when exposed to fire."}
                  </p>
                </div>
              </div>

              {/* RECYCLABLE */}
              <div className="char-item flex items-start gap-6 md:gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <img
                    src={d.tdChar6Icon || "/images/technical data/SVGs/SVGs/icons-07.svg"}
                    alt="Recyclable"
                    className="w-full h-full object-contain scale-[2.2] transition-all duration-500 opacity-100 group-hover:opacity-100 group-hover:scale-[2.35]"
                  />
                </div>
                <div className="flex-1 space-y-2 md:space-y-4">
                  <h3 className="font-michroma text-base md:text-[18px] tracking-[0.15em] uppercase font-light text-white">
                    {d.tdChar6Title || "RECYCLABLE"}
                  </h3>
                  <p className="font-ivymode font-light text-white/90 text-[14px] md:text-[18px] tracking-[0.08em] leading-normal">
                    {d.tdChar6Desc || "Each slab incorporates between 52% - 98% recycled content and is fully reusable and recyclable."}
                  </p>
                </div>
              </div>

              {/* EASY TO MAINTAIN */}
              <div className="char-item flex items-start gap-6 md:gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <img
                    src={d.tdChar7Icon || "/images/technical data/SVGs/SVGs/icons-08.svg"}
                    alt="Easy to Maintain"
                    className="w-full h-full object-contain scale-[2.2] transition-all duration-500 opacity-100 group-hover:opacity-100 group-hover:scale-[2.35]"
                  />
                </div>
                <div className="flex-1 space-y-2 md:space-y-4">
                  <h3 className="font-michroma text-base md:text-[18px] tracking-[0.15em] uppercase font-light text-white">
                    {d.tdChar7Title || "EASY TO MAINTAIN"}
                  </h3>
                  <p className="font-ivymode font-light text-white/90 text-[14px] md:text-[18px] tracking-[0.08em] leading-normal">
                    {d.tdChar7Desc || "Compatible with all types of cleaning agents, including bleach and ammonia."}
                  </p>
                </div>
              </div>

              {/* HIGH FLEXURAL STRENGTH */}
              <div className="char-item flex items-start gap-6 md:gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <img
                    src={d.tdChar8Icon || "/images/technical data/SVGs/SVGs/icons-09.svg"}
                    alt="High Flexural Strength"
                    className="w-full h-full object-contain scale-[2.2] transition-all duration-500 opacity-100 group-hover:opacity-100 group-hover:scale-[2.35]"
                  />
                </div>
                <div className="flex-1 space-y-2 md:space-y-4">
                  <h3 className="font-michroma text-base md:text-[18px] tracking-[0.15em] uppercase font-light text-white">
                    {d.tdChar8Title || "HIGH FLEXURAL STRENGTH"}
                  </h3>
                  <p className="font-ivymode font-light text-white/90 text-[14px] md:text-[18px] tracking-[0.08em] leading-normal">
                    {d.tdChar8Desc || "Designed to withstand heavy loads and pressure without bending or cracking."}
                  </p>
                </div>
              </div>

              {/* HYGIENIC & FOOD SAFE */}
              <div className="char-item flex items-start gap-6 md:gap-8 group">
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <img
                    src={d.tdChar9Icon || "/images/technical data/SVGs/SVGs/icons-10.svg"}
                    alt="Hygienic & Food Safe"
                    className="w-full h-full object-contain scale-[2.2] transition-all duration-500 opacity-100 group-hover:opacity-100 group-hover:scale-[2.35]"
                  />
                </div>
                <div className="flex-1 space-y-2 md:space-y-4">
                  <h3 className="font-michroma text-base md:text-[18px] tracking-[0.15em] uppercase font-light text-white">
                    {d.tdChar9Title || "HYGIENIC & FOOD SAFE"}
                  </h3>
                  <p className="font-ivymode font-light text-white/90 text-[14px] md:text-[18px] tracking-[0.08em] leading-normal">
                    {d.tdChar9Desc || "Non-toxic and free from harmful emissions, 100% food safe, NSF Certified."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* B. User Guide Section */}
          <div className="pt-16">
            <div className="space-y-16">
              <div className="ug-title ug-title-trigger">
                <h2 className="font-ivymode font-light text-white uppercase tracking-[0.06em] md:tracking-[0.15em] text-[clamp(26px,5.5vw,52px)] md:text-[clamp(28px,4.5vw,52px)] leading-tight flex flex-wrap gap-x-[0.3em] md:gap-x-[0.4em]">
                  {(d.tdUgHeading || "USER GUIDE").split(" ").map((word, wIdx) => (
                    <span key={wIdx} className="inline-block whitespace-nowrap">
                      {word.split("").map((char, cIdx) => (
                        <span key={cIdx} className="inline-block overflow-hidden align-bottom py-2 md:py-0 px-[1px]">
                          <span className="ug-title-char inline-block">{char}</span>
                        </span>
                      ))}
                    </span>
                  ))}
                </h2>
              </div>
              <div className="font-ivymode font-light text-white/90 text-[15px] sm:text-[16px] md:text-[20px] tracking-widest w-full space-y-8 md:space-y-12">
                <p className="ug-desc">
                  {d.tdUgDesc1 || "The lasting beauty and performance of a surface depend on proper care and maintenance. To help you preserve the exceptional qualities of NOBILITA porcelain surfaces, we have created a collection of maintenance guidelines."}
                </p>
                <p className="ug-desc">
                  {d.tdUgDesc2 || "Explore our easy-to-follow care instructions and cleaning recommendations. Whether for residential or commercial applications, these guidelines ensure your NOBILITA surfaces continue to perform and look their best for generations to come."}
                </p>
              </div>
            </div>

            {/* B1. Oil Spills Subsection */}
            <div className="spill-sec pt-16">
              <h3 className="font-ivymode font-light text-white uppercase tracking-[0.10em] text-[clamp(22px,3vw,36px)] leading-tight mb-8 md:mb-12">
                OIL SPILLS
              </h3>

              <div className="flex flex-col md:flex-row items-center md:items-center gap-12 md:gap-16">
                {/* Left Side: Spilling Bottle Illustration */}
                <div className="spill-illust relative flex-shrink-0 w-40 md:w-56 h-auto flex items-center justify-center" style={{ perspective: '800px' }}>
                  <OilSpillSVG />
                </div>

                {/* Right Side: Step-by-Step Instructions */}
                <div className="spill-text flex-1 space-y-2 font-ivymode font-light text-white/90 text-[15px] sm:text-[16px] md:text-[20px] tracking-widest">
                  <div className="flex items-start gap-5">
                    <span className="font-normal text-[#cce3eb]">1.</span>
                    <p>Apply the cleaning product and leave for 5 minutes.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-normal text-[#cce3eb]">2.</span>
                    <p>Rub with a scouring pad (use a magic sponge for Polished and Honed finishes).</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-normal text-[#cce3eb]">3.</span>
                    <p>If the stain remains, reapply the product and leave for up to 5 more minutes (do not exceed five minutes on Polished finishes).</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-normal text-[#cce3eb]">4.</span>
                    <p>Rub again using a scouring pad and wipe with a damp cloth and dry thoroughly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* B2. Coffee Spills Subsection */}
            <div className="spill-sec pt-12">
              <h3 className="font-ivymode font-light text-white uppercase tracking-[0.10em] text-[clamp(22px,3vw,36px)] leading-tight mb-8 md:mb-12">
                COFFEE SPILLS
              </h3>

              <div className="flex flex-col md:flex-row items-center md:items-center gap-12 md:gap-16">
                {/* Left Side: Spilling Coffee Cup Illustration */}
                <div className="spill-illust relative flex-shrink-0 w-40 md:w-56 h-auto flex items-center justify-center" style={{ perspective: '800px' }}>
                  <div className="w-[80%] flex justify-center">
                    <CoffeeSpillSVG />
                  </div>
                </div>

                {/* Right Side: Step-by-Step Instructions */}
                <div className="spill-text flex-1 space-y-2 font-ivymode font-light text-white/90 text-[15px] sm:text-[16px] md:text-[20px] tracking-widest">
                  <div className="flex items-start gap-5">
                    <span className="font-normal text-[#cce3eb]">1.</span>
                    <p>Remove any excess liquid immediately.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-normal text-[#cce3eb]">2.</span>
                    <p>Apply a suitable cleaning product and leave for 3–5 minutes.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-normal text-[#cce3eb]">3.</span>
                    <p>Rub with a non-abrasive scouring pad (use a magic sponge for Polished and Honed finishes).</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-normal text-[#cce3eb]">4.</span>
                    <p>Wipe with a damp cloth to remove any residue.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-normal text-[#cce3eb]">5.</span>
                    <p>Dry thoroughly with a clean, soft cloth or paper towel.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* B3. Wine Spills Subsection */}
            <div className="spill-sec pt-12">
              <h3 className="font-ivymode font-light text-white uppercase tracking-[0.10em] text-[clamp(22px,3vw,36px)] leading-tight mb-8 md:mb-12">
                WINE SPILLS
              </h3>

              <div className="space-y-20">
                {/* Upper Row: SVG centered with Points 1-4 only */}
                <div className="flex flex-col md:flex-row items-center md:items-center gap-12 md:gap-16">
                  {/* Left Side: Spilling Wine Glass Illustration */}
                  <div className="spill-illust relative flex-shrink-0 w-40 md:w-56 h-auto flex items-center justify-center" style={{ perspective: '800px' }}>
                    <div className="w-[85%] flex justify-center">
                      <WineSpillSVG />
                    </div>
                  </div>

                  {/* Right Side: Step-by-Step Instructions (Points 1-4) */}
                  <div className="spill-text flex-1 space-y-2 font-ivymode font-light text-white/90 text-[15px] sm:text-[16px] md:text-[20px] tracking-widest">
                    <div className="flex items-start gap-5">
                      <span className="font-normal text-[#cce3eb]">1.</span>
                      <p>Rinse the affected area with warm water.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="font-normal text-[#cce3eb]">2.</span>
                      <p>Apply a pH-neutral cleaner and allow it to act for a few minutes.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="font-normal text-[#cce3eb]">3.</span>
                      <p>Gently clean the surface using a soft sponge or non-abrasive pad.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="font-normal text-[#cce3eb]">4.</span>
                      <p>Wipe away any residue with a damp cloth and dry the surface completely.</p>
                    </div>
                  </div>
                </div>

                {/* Lower Row: Subnote (aligned with the text above) */}
                <div className="wine-subnote flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16">
                  {/* Spacer to align text with the right side column on desktop */}
                  <div className="hidden md:block flex-shrink-0 w-40 md:w-56" />

                  {/* Subnote Content */}
                  <div className="flex-1 space-y-2 font-ivymode font-light text-white/90 text-[15px] sm:text-[16px] md:text-[20px] tracking-widest">
                    <h4 className="font-semibold text-white tracking-[0.05em] text-[20px] md:text-[22px]">
                      For dried or stubborn stains:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-5">
                        <span className="font-normal text-[#cce3eb]">1.</span>
                        <p>Reapply the cleaner and leave for up to 5 minutes.</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="font-normal text-[#cce3eb]">2.</span>
                        <p>Gently rub the area and rinse thoroughly before drying.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Slab Dimensions Section */}
      <section className="w-full bg-[#007190] pt-12 md:pt-16 px-6 md:px-12 lg:px-20 xl:px-24 flex flex-col items-center justify-center">
        <div className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto w-full flex flex-col items-start">

          {/* Subsection 1: Dimensions */}
          <div className="dim-title dim-title-trigger mb-12 md:mb-16 w-full text-left">
            <h2 className="font-ivymode font-light text-white uppercase tracking-[0.06em] md:tracking-[0.15em] text-[clamp(26px,5.5vw,52px)] md:text-[clamp(28px,4.5vw,52px)] leading-tight flex flex-wrap gap-x-[0.3em] md:gap-x-[0.4em]">
              {(d.tdDimHeading || "FORMAT & DIMENSIONS").split(" ").map((word, wIdx) => (
                <span key={wIdx} className="inline-block whitespace-nowrap">
                  {word.split("").map((char, cIdx) => (
                    <span key={cIdx} className="inline-block overflow-hidden align-bottom py-2 md:py-0 px-[1px]">
                      <span className="dim-title-char inline-block">{char}</span>
                    </span>
                  ))}
                </span>
              ))}
            </h2>
          </div>

          {/* Main Content Area: SVG on left, Text on right (on desktop) */}
          <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-stretch justify-between">
            {/* SVG Diagram Container */}
            {dimSvg ? (
              <div
                className="w-full lg:w-[52%] xl:w-[50%] flex items-center justify-center select-none svg-inlined-container [&_svg]:w-full [&_svg]:h-auto dim-svg-trigger"
                dangerouslySetInnerHTML={{ __html: dimSvg }}
              />
            ) : (
              <div className="w-full lg:w-[52%] xl:w-[50%] h-[300px] flex items-center justify-center text-white/50 font-michroma text-xs">
                LOADING DIMENSIONS...
              </div>
            )}

            {/* Slab Dimensions Description Text (Right Column) */}
            <div className="dim-desc-trigger w-full lg:w-[48%] xl:w-[50%] flex flex-col justify-between text-left font-ivymode font-light text-white/90 text-[15px] sm:text-[16px] md:text-[18px] xl:text-[20px] tracking-widest gap-8 lg:gap-0 py-2">
              <p className="dim-desc">
                {d.tdDimDesc1 || "NOBILITA offers large-format porcelain slabs in rectified and non-rectified formats to suit different applications."}
              </p>
              <p className="dim-desc">
                {d.tdDimDesc2 || "RECTIFIED SLABS are precisely trimmed for seamless installation, making them the preferred choice for tiling applications such as flooring, walls, and facades."}
              </p>
              <p className="dim-desc">
                {d.tdDimDesc3 || "NON-RECTIFIED SLABS (Gross) are ideal when custom cutting is required, making them perfect for counter tops, mill work, and furniture."}
              </p>
            </div>
          </div>

        </div>
      </section>      {/* Slab Thicknesses Section */}
      <section className="w-full bg-[#007190] pt-12 md:pt-16 pb-12 md:pb-16 px-6 md:px-12 lg:px-20 xl:px-24 flex flex-col items-center justify-center">
        <div className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-24 items-stretch justify-between">

          {/* Left Column: Title and Paragraph */}
          <div className="thick-text-trigger w-full lg:w-[60%] xl:w-[62%] flex flex-col items-start justify-center text-left py-4">
            <div className="thick-title-trigger mb-6 md:mb-10 w-full text-left">
              <h2 className="font-ivymode font-light text-white uppercase tracking-[0.06em] md:tracking-[0.15em] text-[clamp(26px,5.5vw,52px)] md:text-[clamp(28px,4.5vw,52px)] leading-tight flex flex-wrap gap-x-[0.3em] md:gap-x-[0.4em]">
                {(d.tdThickHeading || "THICKNESSES").split(" ").map((word, wIdx) => (
                  <span key={wIdx} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, cIdx) => (
                      <span key={cIdx} className="inline-block overflow-hidden align-bottom py-2 md:py-0 px-[1px]">
                        <span className="thick-title-char inline-block">{char}</span>
                      </span>
                    ))}
                  </span>
                ))}
              </h2>
            </div>
            <div className="thick-desc space-y-6 mt-6">
              <p className="font-ivymode font-light text-white/90 text-[15px] sm:text-[16px] md:text-[18px] xl:text-[20px] tracking-widest leading-relaxed">
                {d.tdThickDesc1 || "6.5 MM – Lightweight and versatile, 6.5 MM porcelain is ideal for wall cladding, furniture applications and other interior surfaces where reduced weight is preferred."}
              </p>
              <p className="font-ivymode font-light text-white/90 text-[15px] sm:text-[16px] md:text-[18px] xl:text-[20px] tracking-widest leading-relaxed">
                {d.tdThickDesc2 || "12 MM – A robust and durable option, 12 MM porcelain is well suited for flooring, countertops, kitchen worktops and other high-use applications."}
              </p>
            </div>
          </div>

          {/* Right Column: Image with Baked-in Labels */}
          <div className="thick-img-trigger w-full lg:w-[40%] xl:w-[38%] flex items-center justify-end select-none relative py-4">
            {/* Image Wrapper */}
            <div className="relative w-full max-w-[350px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[550px] select-none">
              <svg
                viewBox="161 205 1649 1289"
                className="w-full h-auto object-contain block"
                xmlns="http://www.w3.org/2000/svg"
              >
                <image
                  href="/images/technical%20data/11_drawing.png?v=2.0"
                  xlinkHref="/images/technical%20data/11_drawing.png?v=2.0"
                  x="161"
                  y="205"
                  width="764"
                  height="1289"
                />
              </svg>
              <p className="absolute left-[49.18%] top-[29.25%] -translate-y-1/2 font-ivymode font-light text-white/90 tracking-widest uppercase text-[15px] sm:text-[16px] md:text-[18px] xl:text-[20px] pointer-events-none whitespace-nowrap">
                6.5 mm THICK
              </p>
              <p className="absolute left-[49.18%] top-[70.83%] -translate-y-1/2 font-ivymode font-light text-white/90 tracking-widest uppercase text-[15px] sm:text-[16px] md:text-[18px] xl:text-[20px] pointer-events-none whitespace-nowrap">
                12 mm THICK
              </p>
            </div>
          </div>

        </div>
      </section>
      </div>

      {/* C. Technical Specifications Section */}
      <section className="relative w-full pt-16 mb-20 px-6 md:px-12 lg:px-20 xl:px-24 bg-white text-brand-dark">
        <div className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto flex flex-col items-start w-full space-y-16">
          <div className="text-center w-full">
            <h2 className="specs-title font-ivymode font-light text-[#007190] uppercase tracking-[0.15em] text-[clamp(28px,4.5vw,42px)] leading-tight">
              {d.tdSpecsHeading || "TECHNICAL SPECIFICATIONS FOR PROFESSIONALS"}
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-32 w-full">
            {/* DOWNLOAD ITALIAN */}
            <button
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("open-datasheet-form", { detail: { language: "italian" } }));
              }}
              className="specs-btn relative overflow-hidden border border-[#007190] px-8 md:px-16 py-10 flex flex-col items-center justify-center space-y-2 bg-transparent transition-colors duration-500 group focus:outline-none w-full md:w-auto"
            >
              <span className="absolute -inset-[1px] bg-[#007190] scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
              <span className="relative z-10 font-michroma text-[#007190] text-base md:text-lg tracking-[0.2em] transition-colors duration-500 group-hover:text-white">DOWNLOAD</span>
              <span className="relative z-10 font-michroma text-[#007190] text-base md:text-lg tracking-[0.2em] transition-colors duration-500 group-hover:text-white">ITALIAN</span>
            </button>

            {/* DOWNLOAD ENGLISH */}
            <button
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("open-datasheet-form", { detail: { language: "english" } }));
              }}
              className="specs-btn relative overflow-hidden border border-[#007190] px-8 md:px-16 py-10 flex flex-col items-center justify-center space-y-2 bg-transparent transition-colors duration-500 group focus:outline-none w-full md:w-auto"
            >
              <span className="absolute -inset-[1px] bg-[#007190] scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
              <span className="relative z-10 font-michroma text-[#007190] text-base md:text-lg tracking-[0.2em] transition-colors duration-500 group-hover:text-white">DOWNLOAD</span>
              <span className="relative z-10 font-michroma text-[#007190] text-base md:text-lg tracking-[0.2em] transition-colors duration-500 group-hover:text-white">ENGLISH</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
