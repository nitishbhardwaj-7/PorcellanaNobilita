"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Fixed identity per tile — filter routing and per-tile styling stay pinned
// to these, independent of the editable name/image/desc content below, so
// renaming a tile in the CMS can never break the "explore collection" link.
const finishMeta = [
  { filterName: "Polished", darkText: true, idleOverlay: "bg-transparent", hoverOverlay: "bg-black/[0.03]" },
  { filterName: "Matte", darkText: false, idleOverlay: "bg-black/25", hoverOverlay: "bg-black/10" },
  { filterName: "Honed", darkText: true, idleOverlay: "bg-transparent", hoverOverlay: "bg-black/[0.03]" },
  { filterName: "Structured Matte", darkText: true, idleOverlay: "bg-white/25", hoverOverlay: "bg-white/35" },
  { filterName: "3D-5D Matte", darkText: true, idleOverlay: "bg-transparent", hoverOverlay: "bg-black/[0.03]" },
];

const defaults = [
  {
    name: "POLISHED",
    img: "/images/Links/Onice Bianco 1.jpg",
    desc: "A glossy, reflective finish that brings out the full richness of the design for a luxurious look.",
  },
  {
    name: "MATTE",
    img: "/images/Links/Basaltina matte.jpg",
    desc: "A non-reflective and refined finish, with added slip resistance.",
  },
  {
    name: "HONED",
    img: "/images/Links/Statuario Ultimo 1.jpg",
    desc: "A smooth, satin-like finish that balances subtle sheen with modern elegance.",
  },
  {
    name: "STRUCTURED MATTE",
    img: "/images/Links/White Camouflage Face 1 - Copy.jpg",
    desc: "Leather-inspired texture with subtle richness and enhanced grip.",
  },
  {
    name: "3D / 5D MATTE",
    img: "/images/Travertino Romano Classico Face 1 - Copy.jpg",
    desc: "A multi-dimensional finish that brings depth, texture, and realism to stone surfaces.",
  },
];

interface Props {
  heading?: string;
  finish1Name?: string;
  finish1Image?: string;
  finish1Desc?: string;
  finish2Name?: string;
  finish2Image?: string;
  finish2Desc?: string;
  finish3Name?: string;
  finish3Image?: string;
  finish3Desc?: string;
  finish4Name?: string;
  finish4Image?: string;
  finish4Desc?: string;
  finish5Name?: string;
  finish5Image?: string;
  finish5Desc?: string;
}

export default function FinishesSection({
  heading,
  finish1Name,
  finish1Image,
  finish1Desc,
  finish2Name,
  finish2Image,
  finish2Desc,
  finish3Name,
  finish3Image,
  finish3Desc,
  finish4Name,
  finish4Image,
  finish4Desc,
  finish5Name,
  finish5Image,
  finish5Desc,
}: Props) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const content = [
    { name: finish1Name || defaults[0].name, img: finish1Image || defaults[0].img, desc: finish1Desc || defaults[0].desc },
    { name: finish2Name || defaults[1].name, img: finish2Image || defaults[1].img, desc: finish2Desc || defaults[1].desc },
    { name: finish3Name || defaults[2].name, img: finish3Image || defaults[2].img, desc: finish3Desc || defaults[2].desc },
    { name: finish4Name || defaults[3].name, img: finish4Image || defaults[3].img, desc: finish4Desc || defaults[3].desc },
    { name: finish5Name || defaults[4].name, img: finish5Image || defaults[4].img, desc: finish5Desc || defaults[4].desc },
  ];

  const finishes = content.map((c, i) => ({ ...c, ...finishMeta[i] }));

  const handleFinishClick = (finish: typeof finishes[0]) => {
    router.push(`/explore-collection?finish=${encodeURIComponent(finish.filterName)}`);
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
        {heading || "FINISHES"}
      </motion.h2>

      {/* High-Performance Accordion */}
      <div className="w-full flex flex-col h-[600px] md:h-[900px] gap-2 md:gap-3 overflow-hidden">
        {finishes.map((finish, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={i}
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
