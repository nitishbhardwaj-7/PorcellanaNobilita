"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const wordVariants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function MadeInItalyPage() {
  const handleImageEnter = (selector: string) => {
    gsap.to(selector, { scale: 1.08, duration: 0.8, ease: "power2.out", overwrite: "auto" });
  };

  const handleImageLeave = (selector: string) => {
    gsap.to(selector, { scale: 1.18, duration: 1.2, ease: "power3.out", overwrite: "auto" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 2. Section 2: Modena & Craftsmanship (Line reveals & image scale)
      gsap.fromTo(".sec2-char",
        { y: "120%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, stagger: 0.03, ease: "expo.out", scrollTrigger: { trigger: ".sec2-title", start: "top 85%" } }
      );

      gsap.fromTo(".sec2-line",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: ".sec2-text", start: "top 80%" } }
      );

      gsap.fromTo(".sec2-highlight",
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out", delay: 0.6, scrollTrigger: { trigger: ".sec2-text", start: "top 80%" } }
      );

      const tlImg2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".sec2-container",
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });
      tlImg2.fromTo(".sec2-img-inner",
        { scale: 1.28 },
        { scale: 1.18, duration: 2, ease: "power3.out" }
      );

      // 3. Section 3: Large Format Slabs
      gsap.fromTo(".sec3-line",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.5, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".sec3-text-container", start: "top 85%" } }
      );

      gsap.fromTo(".sec3-highlight",
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out", delay: 0.5, scrollTrigger: { trigger: ".sec3-text-container", start: "top 85%" } }
      );

      const tlImg3Left = gsap.timeline({
        scrollTrigger: {
          trigger: ".sec3-grid",
          start: "top 65%",
          toggleActions: "play none none reverse"
        }
      });
      tlImg3Left.fromTo(".sec3-img-inner-left",
        { scale: 1.28 },
        { scale: 1.18, duration: 2, ease: "power3.out" }
      );

      const tlImg3Right = gsap.timeline({
        scrollTrigger: {
          trigger: ".sec3-grid",
          start: "top 65%",
          toggleActions: "play none none reverse"
        }
      });
      tlImg3Right.fromTo(".sec3-img-inner-right",
        { scale: 1.28 },
        { scale: 1.18, duration: 2, ease: "power3.out" }
      );

      gsap.fromTo(".sec3-bottom-line",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: ".sec3-bottom-text", start: "top 85%" } }
      );

      // 4. Section 4: Colosseum Curtain Reveal & Tag Reveal
      gsap.set(".sec4-label-text", { opacity: 0, y: 14, letterSpacing: "0.5em" });
      gsap.set(".sec4-tag", { opacity: 0, y: 14 });

      const sec4Tl = gsap.timeline({
        scrollTrigger: { trigger: ".sec4-container", start: "top 75%", once: true }
      });
      sec4Tl
        .to(".sec4-curtain-left", { xPercent: -100, duration: 1.5, ease: "power4.inOut" })
        .to(".sec4-curtain-right", { xPercent: 100, duration: 1.5, ease: "power4.inOut" }, "<")
        .to(".sec4-tag", { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.3")
        .to(".sec4-label-text", { opacity: 1, y: 0, letterSpacing: "0.15em", duration: 0.9, ease: "power2.out" }, "-=0.6");
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white text-brand-dark flex flex-col justify-between overflow-x-hidden relative">
      <Navbar />

      {/* Back Button Arrow */}
      <div className="absolute top-20 left-6 md:top-32 md:left-12 z-50">
        <Link
          href="/"
          className="group flex items-center justify-center w-10 h-10 rounded-full border border-brand-dark/20 hover:border-brand-dark/60 bg-brand-dark/[0.03] hover:bg-brand-dark/[0.08] backdrop-blur-sm transition-all duration-300 focus:outline-none"
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

      {/* Section 1: Duomo di Milano Full-width Video Hero */}
      <section className="sec1-container relative w-full pt-12 md:pt-20 overflow-hidden bg-white">
        <div className="relative w-full mx-auto flex flex-col">
          {/* Top Full-width Image/Video Container */}
          <div className="w-full relative aspect-[21/9] md:aspect-[2.39/1] overflow-hidden group mt-0">
            <video
              src="/images/made-in-italy/duomo 2.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sec1-video w-full h-full object-cover origin-center"
            />

            {/* Top Heading Overlay */}
            <div className="absolute inset-0 flex items-start justify-center pt-8 md:pt-6 z-30 pointer-events-none">
              <motion.h1
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="font-ivymode font-light text-[#545759] uppercase tracking-[0.06em] md:tracking-[0.18em] text-[clamp(26px,5.5vw,52px)] md:text-[clamp(26px,5.5vw,66px)] leading-tight drop-shadow-md flex flex-wrap justify-center gap-x-[0.3em] md:gap-x-[0.4em]"
              >
                {["MADE", "IN", "ITALY"].map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden py-2 md:py-0 px-[1px]">
                    <motion.span variants={wordVariants} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>
            </div>

            {/* Overlay Text */}
            <div className="absolute bottom-2 right-3 md:bottom-2 md:right-3 z-30 flex flex-col items-end">
              <span className="sec1-label-text font-ivymode font-light text-white uppercase tracking-[0.15em] text-[clamp(11px,1.2vw,16px)] inline-block drop-shadow-md">
                DUOMO DI MILANO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Made In Italy Intro */}
      <section className="sec2-container relative w-full flex flex-col justify-center pb-12 px-6 md:px-12 lg:px-20 xl:px-24 overflow-hidden border-t border-gray-100 pt-12 md:pt-16">
        {/* Content wrapper */}
        <div className="relative z-10 w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto flex flex-col">

          {/* Grid Layout: Text vs Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-stretch mt-0">
            {/* Left Column: Narrative */}
            <div className="sec2-text flex flex-col justify-center space-y-6 md:space-y-8 font-ivymode font-light text-[#545759] text-[clamp(14px,1.35vw,20px)] tracking-widest leading-[1.8] 2xl:leading-[1.95] text-center md:text-left order-2 md:order-1 h-full py-0 md:py-2">
              <div className="overflow-hidden py-0.5">
                <p className="sec2-line">
                  In the heart of Italy, where rolling hills meet centuries of craftsmanship, lies Modena, a region shaped by the relentless pursuit of excellence. Home to Ferrari, Acetaia Giusti, and Brioni, Modena has long been a place where mastery is refined through patience, precision, and dedication to craft.
                </p>
              </div>

              <div className="overflow-hidden py-0.5">
                <p className="sec2-line">
                  The same spirit defines its porcelain industry. Here, innovation and heritage exist side by side, transforming raw materials into surfaces of{" "}
                  <span className="sec2-highlight inline text-[#007190] font-normal">
                    exceptional quality and enduring beauty.
                  </span>
                </p>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="flex order-1 md:order-2 h-full">
              <div
                className="sec2-img-wrapper group relative w-full h-full border border-gray-100 overflow-hidden cursor-pointer shadow-lg min-h-[320px]"
                onMouseEnter={() => handleImageEnter(".sec2-img-inner")}
                onMouseLeave={() => handleImageLeave(".sec2-img-inner")}
              >
                <img
                  src="/images/made-in-italy/Palazzo_della_civilt%C3%A0_del_lavoro_(EUR,_Rome)_(5904657870).jpg"
                  alt="Palazzo della civiltà del lavoro application"
                  className="sec2-img-inner w-full h-full object-cover block transform-gpu scale-[1.18]"
                  loading="lazy"
                />
                {/* Overlay Text */}
                <div className="absolute bottom-2 right-2 md:bottom-2 md:right-3 z-10">
                  <span className="font-ivymode font-light text-white uppercase tracking-[0.15em] text-[clamp(11px,1.4vw,16px)] 2xl:text-[20px] drop-shadow-md">
                    PALAZZO DELLA CIVILTÀ ITALIANA
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 3: Large Format Slabs */}
      <section className="sec3-container relative w-full px-6 md:px-12 lg:px-20 xl:px-24 overflow-hidden">
        <div className="relative z-10 w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto flex flex-col space-y-12">
          {/* Top Text */}
          <div className="sec3-text-container w-full font-ivymode font-light text-[#545759] text-[clamp(14px,1.35vw,20px)] tracking-widest leading-[1.8] 2xl:leading-[1.95] text-center md:text-left space-y-6 md:space-y-8">
            <div className="overflow-hidden py-0.5">
              <p className="sec3-line">
                Every NOBILITA slab is born from this tradition, crafted with Italian expertise, engineered for performance, and designed to stand the test of time.
              </p>
            </div>
            <div className="overflow-hidden py-0.5">
              <p className="sec3-line">
                More than a surface, it is a{" "}
                <span className="sec3-highlight inline text-[#007190] font-normal">
                  legacy of craftsmanship made for generations to come.
                </span>
              </p>
            </div>
          </div>

          {/* Grid Layout: Two Images */}
          <div className="sec3-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
            {/* Left Image */}
            <div
              className="sec3-img-wrapper-left group relative w-full h-full border border-gray-100 overflow-hidden cursor-pointer shadow-lg min-h-[300px] md:min-h-[400px]"
              onMouseEnter={() => handleImageEnter(".sec3-img-inner-left")}
              onMouseLeave={() => handleImageLeave(".sec3-img-inner-left")}
            >
              <img
                src="/images/made-in-italy/factory-image.jpeg"
                alt="Factory"
                className="sec3-img-inner-left w-full h-full object-cover block transform-gpu scale-[1.18]"
                loading="lazy"
              />
            </div>

            {/* Right Image */}
            <div
              className="sec3-img-wrapper-right group relative w-full h-full border border-gray-100 overflow-hidden cursor-pointer shadow-lg min-h-[300px] md:min-h-[400px]"
              onMouseEnter={() => handleImageEnter(".sec3-img-inner-right")}
              onMouseLeave={() => handleImageLeave(".sec3-img-inner-right")}
            >
              <img
                src="/images/made-in-italy/continua-impianto-hd-2.jpg"
                alt="Large Format Slabs Processing Unit"
                className="sec3-img-inner-right w-full h-full object-cover block transform-gpu scale-[1.18]"
                loading="lazy"
              />
              {/* Overlay Text */}
              <div className="absolute bottom-2 right-2 md:bottom-2 md:right-3 z-10">
                <span className="font-ivymode font-light text-white uppercase tracking-[0.15em] text-[clamp(10px,1.2vw,16px)] 2xl:text-[20px] drop-shadow-md">
                  LARGE FORMAT SLABS PROCESSING UNIT
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="sec3-bottom-text w-full font-ivymode font-light text-[#545759] text-[clamp(14px,1.35vw,20px)] tracking-widest leading-[1.8] 2xl:leading-[1.95] text-center md:text-left">
            <div className="overflow-hidden py-0.5">
              <p className="sec3-bottom-line mb-12">
                NOBILITA works at the forefront of large-format surface innovation, with state-of-the-art production systems capable of creating ultra-large slabs in exceptional formats and multiple thicknesses. These advancements have redefined what is possible in contemporary architecture, enabling seamless surfaces, reduced visual fragmentation, and a more monolithic architectural language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Colosseum Background Parallax Reveal */}
      <section className="sec4-container relative w-full h-screen overflow-hidden bg-white">
        <div className="sec4-img-wrapper relative w-full h-full mx-auto group overflow-hidden">
          {/* Background Image (Responsive Desktop / Mobile) */}
          <picture className="w-full h-full block">
            <source
              media="(max-width: 767px)"
              srcSet="/images/made-in-italy/colosseo-mobile.jpg"
            />
            <img
              src="/images/made-in-italy/colosseo-2020-compressed.jpg"
              alt="Colosseum"
              className="sec4-img-inner w-full h-full object-cover block origin-center will-change-transform"
              loading="lazy"
            />
          </picture>

          {/* Curtain reveal panels */}
          <div className="sec4-curtain-left absolute inset-y-0 left-0 w-1/2 bg-white z-20 pointer-events-none" />
          <div className="sec4-curtain-right absolute inset-y-0 right-0 w-1/2 bg-white z-20 pointer-events-none" />

          {/* Headline Image Overlay - Positioned at top */}
          <div className="absolute top-8 md:top-14 lg:top-16 left-1/2 -translate-x-1/2 z-30 flex justify-center px-4 w-full pointer-events-none">
            <img
              src="/images/Links/tag grey.png"
              alt="Il Gres Imperiale d'Italia"
              className="sec4-tag w-full max-w-sm md:max-w-2xl lg:max-w-5xl h-auto object-contain drop-shadow-sm opacity-90"
              loading="lazy"
            />
          </div>

          {/* Overlay Text */}
          <div className="absolute bottom-2 right-3 md:bottom-2 md:right-3 lg:right-3 z-30">
            <span className="sec4-label-text font-ivymode font-light text-white uppercase text-[clamp(11px,1.4vw,16px)] drop-shadow-md inline-block">
              COLOSSEUM
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

