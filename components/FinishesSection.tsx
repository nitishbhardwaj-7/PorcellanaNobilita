"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const finishes = [
  {
    name: "POLISHED",
    img: "/images/Links/Onice Bianco 1.jpg",
    darkText: true,
    desc: "A glossy, reflective finish that brings out the full richness of the design for a luxurious look.",
    idleOverlay: "bg-transparent",
    hoverOverlay: "bg-black/[0.03]"
  },
  {
    name: "MATTE",
    img: "/images/Links/Basaltina matte.jpg",
    darkText: false,
    desc: "A non-reflective and refined finish, with added slip resistance.",
    idleOverlay: "bg-black/25",
    hoverOverlay: "bg-black/10"
  },
  {
    name: "HONED",
    img: "/images/Links/Statuario Ultimo 1.jpg",
    darkText: true,
    desc: "A smooth, satin-like finish that balances subtle sheen with modern elegance.",
    idleOverlay: "bg-transparent",
    hoverOverlay: "bg-black/[0.03]"
  },
  {
    name: "STRUCTURED MATTE",
    img: "/images/Links/White Camouflage Face 1 - Copy.jpg",
    darkText: true,
    desc: "Leather-inspired texture with subtle richness and enhanced grip.",
    idleOverlay: "bg-white/25",
    hoverOverlay: "bg-white/35"
  },
  {
    name: "3D / 5D MATTE",
    img: "/images/Travertino Romano Classico Face 1 - Copy.jpg",
    darkText: true,
    desc: "A multi-dimensional finish that brings depth, texture, and realism to stone surfaces.",
    idleOverlay: "bg-transparent",
    hoverOverlay: "bg-black/[0.03]"
  },
];

export default function FinishesSection() {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleFinishClick = (finish: typeof finishes[0]) => {
    let filterName = "";
    if (finish.name === "POLISHED") filterName = "Polished";
    else if (finish.name === "MATTE") filterName = "Matte";
    else if (finish.name === "HONED") filterName = "Honed";
    else if (finish.name === "STRUCTURED MATTE") filterName = "Structured Matte";
    else if (finish.name === "3D / 5D MATTE") filterName = "3D-5D Matte";

    router.push(`/explore-collection?finish=${encodeURIComponent(filterName)}`);
  };

  return (
    <section className="w-full bg-white mt-[40px] flex flex-col items-center">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="font-ivymode text-[clamp(28px,4.5vw,66px)] text-[#545759] tracking-[0.2em] text-center mb-[40px] uppercase"
      >
        FINISHES
      </motion.h2>

      {/* High-Performance Accordion */}
      <div className="w-full flex flex-col h-[600px] md:h-[900px] gap-2 md:gap-3 overflow-hidden">
        {finishes.map((finish, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={finish.name}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleFinishClick(finish)}
              className="group relative w-full overflow-hidden cursor-pointer transition-[flex-grow] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[flex-grow]"
              style={{
                flexGrow: isHovered ? 2.5 : 1,
                flexBasis: 0,
                transform: "translate3d(0,0,0)",
                backfaceVisibility: "hidden"
              }}
            >
              {/* Texture Image with Framer Motion Ken Burns */}
              <motion.img
                src={finish.img}
                alt={finish.name}
                loading="lazy"
                initial={{ scale: 1 }}
                animate={{ scale: isHovered ? 1.06 : 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full object-cover origin-center"
              />

              {/* Overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isHovered ? finish.hoverOverlay : finish.idleOverlay
                  }`}
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-24 z-10 pointer-events-none">
                <div className="relative">
                  <div className="flex items-center space-x-4 md:space-x-6">
                    <span className={`font-michroma text-[clamp(10px,1.2vw,16px)] tracking-widest ${finish.darkText ? 'text-brand-dark/50' : 'text-white/40'
                      }`}>
                      0{i + 1}
                    </span>

                    <motion.h3
                      animate={{ letterSpacing: isHovered ? "0.28em" : "0.2em" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className={`font-didotbold font-medium uppercase text-[clamp(14px,2.2vw,28px)] ${finish.darkText ? 'text-[#545759]' : 'text-white'
                        }`}
                      style={{ fontFamily: "var(--font-didotbold)" }}
                    >
                      {finish.name}
                    </motion.h3>
                  </div>

                  {/* Smooth Absolute Overlay Reveal using AnimatePresence (keeps vertical position static) */}
                  <AnimatePresence initial={false}>
                    {isHovered && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute top-full left-0 font-michroma max-w-full ml-8 md:ml-[45px] text-[clamp(14px,1.8vw,18px)] mt-4 pointer-events-none ${finish.darkText ? 'text-[#545759]' : 'text-white/80'
                          }`}
                        style={{ wordSpacing: "0.22em" }}
                      >
                        {finish.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          );
        })}
      </div>


    </section>
  );
}
