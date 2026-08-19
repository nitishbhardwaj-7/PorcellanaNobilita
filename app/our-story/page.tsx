"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NobilitaHouseSVG from "@/components/NobilitaHouseSVG";
import dynamic from "next/dynamic";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const FeaturedProduct = dynamic(() => import("@/components/FeaturedProduct"), { ssr: false });

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

const paragraphWordVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: (customDelay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
      delay: customDelay
    }
  })
};

function OurStoryContent() {
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpenedFromSessionRef = useRef(false);

  useEffect(() => {
    const productName = searchParams?.get("product");
    if (productName) {
      setActiveProduct(productName);
    } else {
      setActiveProduct(null);
    }
  }, [searchParams]);

  const handleProductSelect = (productName: string) => {
    isOpenedFromSessionRef.current = true;
    const params = new URLSearchParams(searchParams.toString());
    params.set("product", productName);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleProductClose = () => {
    if (isOpenedFromSessionRef.current) {
      router.back();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("product");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    isOpenedFromSessionRef.current = false;
  };

  const handleImageEnter = (selector: string) => {
    gsap.to(selector, { scale: 1.08, duration: 0.8, ease: "power2.out", overwrite: "auto" });
  };

  const handleImageLeave = (selector: string) => {
    gsap.to(selector, { scale: 1.18, duration: 1.2, ease: "power3.out", overwrite: "auto" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Section (On Load)
      const tlHero = gsap.timeline({ delay: 0.3 });
      tlHero.from(".hero-house", { opacity: 0, y: 40, duration: 1.5, ease: "power3.out" })
        .from(".hero-logo", { opacity: 0, scale: 0.95, duration: 1.2, ease: "power3.out" }, "-=1");

      // 2. Section 2
      gsap.fromTo(".sec2-bg",
        { scale: 1.08 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: ".sec2-container", start: "top bottom", end: "bottom top", scrub: true } }
      );

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

      const tlImg = gsap.timeline({
        scrollTrigger: {
          trigger: ".sec2-container",
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });
      tlImg.fromTo(".sec2-img-inner",
        { scale: 1.28 },
        { scale: 1.18, duration: 2, ease: "power3.out" }
      );

      // 3. Section 3 — luxury curtain reveal + tag tagline reveal + label
      gsap.set(".sec3-label-text", { opacity: 0, y: 14, letterSpacing: "0.5em" });
      gsap.set(".sec3-tag-grey", { opacity: 0, y: 24, scale: 0.94, filter: "blur(6px)" });

      const sec3Tl = gsap.timeline({
        scrollTrigger: { trigger: ".sec3-container", start: "top 75%", once: true }
      });
      sec3Tl
        .to(".sec3-curtain-left", { xPercent: -100, duration: 1.4, ease: "power4.inOut" })
        .to(".sec3-curtain-right", { xPercent: 100, duration: 1.4, ease: "power4.inOut" }, "<")
        .to(".sec3-tag-grey", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, "+=0.1")
        .to(".sec3-label-text", { opacity: 1, y: 0, letterSpacing: "0.20em", duration: 0.9, ease: "power2.out" }, "-=0.6");

      gsap.from(".sec3-text p", {
        opacity: 0, y: 30, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".sec3-text", start: "top 85%" }
      });

      // 4. Section 4
      gsap.fromTo(".sec4-bg",
        { scale: 1.08 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: ".sec4-container", start: "top bottom", end: "bottom top", scrub: true } }
      );

      gsap.fromTo(".sec4-char",
        { y: "120%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, stagger: 0.03, ease: "expo.out", scrollTrigger: { trigger: ".sec4-title", start: "top 85%" } }
      );

      gsap.fromTo(".sec4-line",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: ".sec4-text", start: "top 80%" } }
      );

      gsap.fromTo(".sec4-highlight",
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out", delay: 0.6, scrollTrigger: { trigger: ".sec4-text", start: "top 80%" } }
      );

      const tlImg4 = gsap.timeline({
        scrollTrigger: {
          trigger: ".sec4-container",
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });
      tlImg4.fromTo(".sec4-img-inner",
        { scale: 1.28 },
        { scale: 1.18, duration: 2, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white text-brand-dark flex flex-col justify-between overflow-x-hidden relative">
      <Navbar />

      {/* Back Button Arrow */}
      <div className="absolute top-6 left-6 md:top-8 md:left-12 z-50">
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

      {/* Main Content / First Section */}
      <section className="w-full flex items-center pt-[clamp(2rem,5vw,4.5rem)] pb-[clamp(2rem,4vw,4rem)] relative">
        <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24 flex flex-col md:flex-row md:items-stretch gap-6 md:gap-[clamp(2rem,4vw,5rem)]">
          {/* Left Column: House SVG & Logo */}
          <div className="shrink-0 flex flex-col items-center justify-between gap-6 md:gap-0 md:py-0.5">
            {/* House Sketch */}
            <div className="hero-house flex justify-center">
              <NobilitaHouseSVG
                variant="dark"
                size={240}
                animate={true}
                className="opacity-90 max-w-full w-[clamp(120px,15vw,220px)] h-auto"
              />
            </div>

            {/* Logo Block */}
            <div className="hero-logo w-[clamp(100px,13vw,190px)]">
              <img
                src="/images/Links/NOBILITA Logo BLACK.png"
                alt="Porcellana Nobilita"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Column: Story Text */}
          <div className="flex-1 flex flex-col justify-between items-center md:items-start text-center md:text-left min-w-0">
            <motion.h1
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="hero-title font-ivymode font-light text-[#545759] uppercase tracking-[clamp(0.06em,0.7vw,0.15em)] text-[clamp(26px,4.5vw,62px)] leading-tight flex flex-wrap justify-center md:justify-start gap-x-[0.35em]"
            >
              {["OUR", "STORY"].map((word, i) => (
                <span key={i} className="inline-block overflow-hidden py-1 md:py-0 px-[1px]">
                  <motion.span variants={wordVariants} className="inline-block">
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.3, delayChildren: 0.6 } }
              }}
              className="hero-text font-ivymode font-light text-[#545759] text-[clamp(14px,1.35vw,20px)] tracking-widest leading-[1.75] space-y-[clamp(1rem,1.75vw,1.6rem)] mt-[clamp(1.25rem,2.5vw,2.5rem)] text-center md:text-left"
            >
              <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}>
                In the grand halls of Renaissance palaces and Baroque villas, architecture was never just about building. It was an expression of culture, craftsmanship, and an enduring pursuit of beauty.
              </motion.p>
              <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}>
                The world's greatest cities were shaped by spaces that celebrated proportion, artistry, and material excellence.
              </motion.p>
              <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}>
                Among their defining features was the <span className="text-[#007190] font-normal">Piano Nobile – the noble floor. <br /> </span> Elevated above the bustle of the streets, it was the heart of the home, where marble, light, and masterful detailing came together to create spaces of remarkable elegance.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Piano Nobile, Reimagined */}
      <section className="sec2-container relative w-full pt-8 pb-8 md:pt-[60px] md:pb-[80px] overflow-hidden border-t border-gray-100 flex flex-col">
        {/* Background Marble Slab */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/Links/Arbescato Fjord Face 1.jpg"
            alt="Arabescato Fjord background"
            className="sec2-bg w-full h-full object-cover opacity-100 origin-center scale-[1.05]"
          />
        </div>

        {/* Centered Heading */}
        <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24 z-10 shrink-0">
          <h2 className="sec2-title font-ivymode font-light text-[#545759] uppercase tracking-[0.06em] md:tracking-[0.18em] text-[clamp(24px,5.5vw,66px)] md:text-[clamp(28px,4.5vw,66px)] leading-tight flex flex-wrap justify-center gap-x-[0.3em] md:gap-x-[0.4em]">
            {"PIANO NOBILE, REIMAGINED".split(" ").map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((char, cIdx) => (
                  <span key={cIdx} className="inline-block overflow-hidden align-bottom py-2 md:py-0 px-[1px]">
                    <span className="sec2-char inline-block">{char}</span>
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24 z-10 mt-8 md:mt-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center w-full">
            {/* Left Column: Narrative (7 cols) */}
            <div className="sec2-text md:col-span-7 flex flex-col space-y-4 md:space-y-5 font-ivymode font-light text-[#545759] text-[clamp(14px,1.35vw,20px)] tracking-widest leading-[1.8] 2xl:leading-[1.95] text-center md:text-left">
              <div className="overflow-hidden py-0.5">
                <p className="sec2-line">
                  NOBILITA takes its name from this tradition.
                </p>
              </div>

              <div className="overflow-hidden py-0.5">
                <p className="sec2-line">
                  NOBILITA represents a philosophy rather than a status. It is a
                  belief that exceptional materials, thoughtful design, and skilled
                  craftsmanship have the power to elevate everyday spaces into
                  something{" "}
                  <span className="sec2-highlight inline-block text-[#007190] font-normal">
                    extraordinary.
                  </span>
                </p>
              </div>

              <div className="overflow-hidden py-0.5">
                <p className="sec2-line">
                  Today, that philosophy guides everything we do.
                </p>
              </div>
            </div>

            {/* Right Column: Verde Profondo Image (5 cols) */}
            <div className="md:col-span-5 flex justify-end items-center">
              <div
                className="sec2-img-wrapper group relative w-full max-w-[400px] xl:max-w-[480px] 2xl:max-w-[560px] shadow-lg border border-white/20 overflow-hidden cursor-pointer"
                onMouseEnter={() => handleImageEnter(".sec2-img-inner")}
                onMouseLeave={() => handleImageLeave(".sec2-img-inner")}
              >
                <img
                  src="/images/Our story/Verde profondo application.jpg"
                  alt="Verde Profondo application"
                  className="sec2-img-inner w-full h-auto object-contain block transform-gpu scale-[1.18]"
                  loading="lazy"
                />

                {/* Bottom Right Text Button */}
                <div className="absolute bottom-2 right-2 md:bottom-2 md:right-2 z-20">
                  <button
                    onClick={() => handleProductSelect("Verde Profondo")}
                    className="relative overflow-hidden border border-white/0 text-white bg-transparent px-3.5 py-1.5 font-ivymode font-light text-[clamp(10px,1vw,13px)] uppercase tracking-[0.20em] transition-all duration-500 ease-out group-hover:border-white block"
                  >
                    <span className="absolute -inset-[1px] bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
                    <span className="relative z-10 block transition-colors duration-500 group-hover:text-black drop-shadow-md group-hover:drop-shadow-none">
                      VERDE PROFONDO
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Arabescato Vagli Bookmatch Section */}
      <section className="sec3-container w-full flex flex-col bg-white">
        {/* Top Full-width Image */}
        <div className="w-full relative overflow-hidden group">
          <video
            src="/images/Our%20story/qqq.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="sec3-img w-full h-auto object-contain block mx-auto"
          />

          {/* Curtain reveal panels */}
          <div className="sec3-curtain-left absolute inset-y-0 left-0 w-1/2 bg-white z-20 pointer-events-none" />
          <div className="sec3-curtain-right absolute inset-y-0 right-0 w-1/2 bg-white z-20 pointer-events-none" />

          {/* Tagline Image (tag) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[75%] max-w-[340px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px] xl:max-w-[900px] pointer-events-none flex justify-center">
            <img
              src="/images/Links/tag.png"
              alt="Il Gres Imperiale d'Italia"
              className="sec3-tag-grey w-full h-auto object-contain transform-gpu"
              loading="lazy"
            />
          </div>

          {/* Bottom Right Text Button */}
          <div className="absolute bottom-2 right-2 md:bottom-2 md:right-3 z-30">
            <button
              onClick={() => handleProductSelect("Basaltina")}
              className="sec3-label-text relative overflow-hidden border border-white/0 text-white bg-transparent px-3.5 py-1.5 font-ivymode font-light text-[clamp(10px,1vw,13px)] uppercase tracking-[0.20em] transition-all duration-500 ease-out group-hover:border-white block cursor-pointer"
            >
              <span className="absolute -inset-[1px] bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
              <span className="relative z-10 block transition-colors duration-500 group-hover:text-black drop-shadow-md group-hover:drop-shadow-none">
                BASALTINA
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Narrative Text */}
        <div className="sec3-text w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto bg-white px-6 md:px-12 lg:px-20 xl:px-24 pt-[40px] pb-[40px] md:pt-[60px] md:pb-[60px] text-center md:text-left">
          <div className="w-full">
            <p className="font-ivymode font-light text-[#545759] text-[clamp(14px,1.35vw,20px)] tracking-widest leading-[1.8] 2xl:leading-[1.95]">
              At NOBILITA, we work closely with architects, designers, and discerning clients to create architectural experiences. Through careful selection, expert craftsmanship, and a deep understanding of design, we help create spaces that feel timeless rather than trend-driven.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Next Generation Porcelain */}
      <section className="sec4-container relative w-full pt-8 pb-8 md:pt-[60px] md:pb-[80px] overflow-hidden border-t border-gray-100 flex flex-col">
        {/* Background Marble Slab */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/Links/Fior Di Melo Face 1.jpg"
            alt="Fior Di Melo background"
            className="sec4-bg w-full h-full object-cover opacity-100 origin-center scale-[1.08]"
          />
        </div>

        {/* Centered Heading */}
        <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-8 lg:px-12 xl:px-16 z-10 shrink-0">
          <h2 className="sec4-title font-ivymode font-light text-[#545759] uppercase tracking-[0.06em] md:tracking-[0.08em] lg:tracking-[0.12em] xl:tracking-[0.16em] text-[clamp(24px,5.5vw,66px)] md:text-[clamp(28px,4.5vw,66px)] leading-tight flex flex-wrap md:flex-nowrap justify-center gap-x-[0.25em] md:gap-x-[0.35em]">
            {"NEXT GENERATION PORCELAIN".split(" ").map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((char, cIdx) => (
                  <span key={cIdx} className="inline-block overflow-hidden align-bottom py-2 md:py-0 px-[1px]">
                    <span className="sec4-char inline-block">{char}</span>
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24 z-10 mt-8 md:mt-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center w-full">
            {/* Left Column: Image (5 cols) */}
            <div className="md:col-span-5 flex justify-start items-center">
              <div
                className="sec4-img-wrapper group relative w-full max-w-[400px] xl:max-w-[480px] 2xl:max-w-[560px] shadow-lg border border-white/20 overflow-hidden cursor-pointer"
                onMouseEnter={() => handleImageEnter(".sec4-img-inner")}
                onMouseLeave={() => handleImageLeave(".sec4-img-inner")}
              >
                <img
                  src="/images/Our story/Ferro Industriale (2).jpg"
                  alt="Ferro Industriale application"
                  className="sec4-img-inner w-full h-auto object-contain block transform-gpu scale-[1.18]"
                  loading="lazy"
                />

                {/* Bottom Left Text Button */}
                <div className="absolute bottom-2 left-2 md:bottom-2 md:left-2 z-20">
                  <button
                    onClick={() => handleProductSelect("Ferro Industriale")}
                    className="relative overflow-hidden border border-white/0 text-white bg-transparent px-3.5 py-1.5 font-ivymode font-light text-[clamp(10px,1vw,13px)] uppercase tracking-[0.20em] transition-all duration-500 ease-out group-hover:border-white block"
                  >
                    <span className="absolute -inset-[1px] bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
                    <span className="relative z-10 block transition-colors duration-500 group-hover:text-black drop-shadow-md group-hover:drop-shadow-none">
                      FERRO INDUSTRIALE
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative (7 cols) */}
            <div className="sec4-text md:col-span-7 flex flex-col space-y-4 md:space-y-5 font-ivymode font-light text-[#545759] text-[clamp(14px,1.35vw,20px)] tracking-widest leading-[1.8] 2xl:leading-[1.95] text-center md:text-left">
              <div className="overflow-hidden py-0.5">
                <p className="sec4-line">
                  Our inspiration comes from the great interiors of the past, but
                  our vision is firmly contemporary: bringing the beauty, depth,
                  and sophistication of natural stone into modern spaces through
                  advanced porcelain surfaces.
                </p>
              </div>

              <div className="overflow-hidden py-0.5">
                <p className="sec4-line">
                  Because true luxury is not defined by excess.
                </p>
              </div>

              <div className="overflow-hidden py-0.5">
                <p className="sec4-line">
                  It is defined by{" "}
                  <span className="sec4-highlight inline-block text-[#007190] font-normal">
                    beauty that endures.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <FeaturedProduct
        activeProduct={activeProduct}
        onClose={handleProductClose}
      />
    </div>
  );
}

export default function OurStoryPage() {
  return (
    <Suspense fallback={null}>
      <OurStoryContent />
    </Suspense>
  );
}
