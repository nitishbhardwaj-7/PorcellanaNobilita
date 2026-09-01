"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "./Navbar";

interface HeroSlide {
  image: string;
  label: string;
  textColor: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  slides?: HeroSlide[];
}

// Fallback slideshow — used until Admin > Homepage has slides in the database.
const defaultSlideshowImages = [
  {
    src: "/images/NewImages/Arabescato%20Fjord.jpg",
    name: "ARABESCATO FJORD",
    textColor: "black"
  },
  {
    src: "/images/NewImages/Calacatta%20Oyster%20application.jpg",
    name: "CALACATTA OYSTER",
    textColor: "white"
  },
  {
    src: "/images/NewImages/Ferro%20Industriale%20(3).jpg",
    name: "FERRO INDUSTRIALE",
    textColor: "white"
  },
  {
    src: "/images/NewImages/Gris%20Di%20Savoie%20(2).jpg",
    name: "GRIS DI SAVOIE",
    textColor: "white"
  },
  {
    src: "/images/NewImages/Piasentina%20Application.jpg",
    name: "PIASENTINA",
    textColor: "white"
  },
  {
    src: "/images/NewImages/Travetino%20Vein%20Cut%20Application%203.jpg",
    name: "TRAVERTINO ROMANO CLASSICO VEIN CUT",
    textColor: "white"
  },
  {
    src: "/images/NewImages/Basaltina.jpg",
    name: "BASALTINA",
    textColor: "white"
  },
  {
    src: "/images/NewImages/Verde%20profondo%20application%20new.jpg",
    name: "VERDE PROFONDO",
    textColor: "white"
  },
  {
    src: "/images/NewImages/silver%20root.jpg",
    name: "SILVER ROOT",
    textColor: "white"
  },
  {
    src: "/images/NewImages/Calacatta%20BorghinI.png",
    name: "CALACATTA BORGHINI",
    textColor: "white"
  },
  {
    src: "/images/NewImages/La%20Quadrifoglio%20%281%29%20copy%20%281%29.jpg",
    name: "LA QUADRIFOGLIO",
    textColor: "white"
  },
  {
    src: "/images/NewImages/Fior%20Di%20Melo.jpg",
    name: "FIOR DI MELO",
    textColor: "black"
  },
  {
    src: "/images/NewImages/taj%20mahal.jpg",
    name: "TAJ MAHAL",
    textColor: "black"
  },
  {
    src: "/images/NOBILITA%20VERDE%20ALPI%203.png",
    name: "VERDE ALPI",
    textColor: "white"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    }
  }
};

const wordVariants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1]
    }
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

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.45 }
  }
};

const buttonTextVariants = {
  hidden: { letterSpacing: "0.48em", opacity: 0 },
  visible: {
    letterSpacing: "0.3em",
    opacity: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.55 }
  }
};

export default function HeroSection({ title, subtitle, buttonText, buttonLink, slides }: Props) {
  // CMS-managed slides (Admin > Homepage) win when present; otherwise fall
  // back to the bundled default slideshow so the section never renders empty.
  const slideshowImages = slides && slides.length > 0
    ? slides.map((s) => ({ src: s.image, name: s.label, textColor: s.textColor }))
    : defaultSlideshowImages;

  const [{ current, prev }, setImageIndices] = useState({ current: 0, prev: null as number | null });

  useEffect(() => {
    slideshowImages.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndices((state) => ({
        current: (state.current + 1) % slideshowImages.length,
        prev: state.current
      }));
    }, 10000);
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setImageIndices((state) => ({
      current: (state.current + 1) % slideshowImages.length,
      prev: state.current
    }));
  };

  const prevSlide = () => {
    setImageIndices((state) => ({
      current: (state.current - 1 + slideshowImages.length) % slideshowImages.length,
      prev: state.current
    }));
  };

  const defaultTitle = "EXPLORE THE COLLECTION";
  const defaultSubtitle = "At NOBILITA, we believe that true luxury is not about trends, it is timeless design, enduring quality, and a deep respect\nfor architectural legacy. Our porcelain tiles are not just surfaces, they are foundations for homes, businesses, and\nlandmarks that will stand for generations.";
  const defaultButtonText = "VIEW ALL PRODUCTS";

  const headline = title || defaultTitle;
  const words = headline.split(" ");

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-brand-dark">
      {/* Stacked image layers — GSAP crossfades between them */}
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={slideshowImages[current].src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slideshowImages[current].src}
              alt={`${slideshowImages[current].name} slab application interior`}
              className="absolute inset-0 w-full h-full object-cover object-bottom max-w-none"
            />
            {/* Name label lives inside the layer — fades with the image automatically */}
            <div className="absolute bottom-2 right-3 md:bottom-2 md:right-3 z-20 pointer-events-none select-none text-right">
              <span
                className="font-ivymode tracking-[0.20em] text-[clamp(11px,1.1vw,15px)] lg:text-[clamp(13px,1.2vw,18px)] uppercase font-light"
                style={{ color: slideshowImages[current].textColor === "white" ? "#ffffff" : "#000000" }}
              >
                {slideshowImages[current].name}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Subtle premium overlay */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />
      </div>

      <Navbar />

      <div className="absolute inset-0 flex flex-col items-center justify-between pt-[10vh] pb-[10vh] px-6 md:px-12 2xl:px-20 z-10">
        <div className="flex flex-col items-center justify-between h-full w-full max-w-[1300px] xl:max-w-[1800px] 2xl:max-w-[2200px] text-center">
          {/* Word-by-word reveal heading */}
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="font-ivymode text-white leading-tight tracking-[0.06em] md:tracking-[0.1em] text-[clamp(28px,6.5vw,66px)] md:text-[clamp(28px,4.5vw,66px)] 2xl:text-[84px] uppercase flex flex-wrap md:flex-nowrap justify-center gap-x-[0.25em] md:gap-x-[0.4em]"
          >
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden py-2 md:py-1 px-[1px]">
                <motion.span
                  variants={wordVariants}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Mobile Version: Clean normal paragraph flow */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="block md:hidden font-ivymode text-white/95 text-[14px] sm:text-[15px] font-extralight leading-[26px] my-auto px-2 pt-6 text-center tracking-wider"
          >
            {(subtitle || defaultSubtitle).replace(/\n/g, " ").split(" ").map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block overflow-hidden align-bottom mx-[0.15em]">
                <motion.span
                  custom={0.15 + wordIdx * 0.008}
                  variants={paragraphWordVariants}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.div>

          {/* Desktop Version: Preserved original width and styling for Mac/laptops, scaled for 2xl displays */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="hidden md:block font-ivymode text-white/95 text-[18px] 2xl:text-[22px] font-extralight leading-[32px] 2xl:leading-[40px] w-full max-w-[1150px] 2xl:max-w-[1550px] tracking-widest my-auto px-4 pt-10 text-center"
          >
            {(subtitle || defaultSubtitle).replace(/\n/g, " ").split(" ").map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block overflow-hidden align-bottom mx-[0.15em]">
                <motion.span
                  custom={0.15 + wordIdx * 0.008}
                  variants={paragraphWordVariants}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={buttonVariants}
            className="w-full mt-auto mb-5 flex justify-center"
          >
            <Link href={buttonLink || "/explore-collection"}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="relative overflow-hidden border border-white text-white bg-transparent px-8 py-2.5 2xl:px-12 2xl:py-3.5 font-michroma text-[clamp(12px,1.5vw,20px)] 2xl:text-[22px] tracking-[0.25em] transition-colors duration-500 uppercase group"
              >
                <span className="absolute -inset-[1px] bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
                <motion.span
                  variants={buttonTextVariants}
                  className="relative z-10 block transition-colors duration-500 group-hover:text-black"
                >
                  {buttonText || defaultButtonText}
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Left Arrow Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 2xl:left-14 top-1/2 -translate-y-1/2 z-30 text-white/30 hover:text-white transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 p-2 hover:scale-110 flex items-center justify-center"
        aria-label="Previous Slide"
      >
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 md:w-7 2xl:w-10 h-auto">
          <path d="M20 6H2M2 6L7 1M2 6L7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Right Arrow Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 2xl:right-14 top-1/2 -translate-y-1/2 z-30 text-white/30 hover:text-white transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 p-2 hover:scale-110 flex items-center justify-center"
        aria-label="Next Slide"
      >
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 md:w-7 2xl:w-10 h-auto">
          <path d="M0 6H18M18 6L13 1M18 6L13 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
