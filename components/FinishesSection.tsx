"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { colorClass, fontClass, headingSizeClass, paragraphSizeClass } from "@/lib/textStyle";

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
  headingColor?: string;
  headingFont?: string;
  headingSize?: string;
  finish1Name?: string;
  finish1Image?: string;
  finish1Desc?: string;
  finish1DescColor?: string;
  finish1DescFont?: string;
  finish1DescSize?: string;
  finish2Name?: string;
  finish2Image?: string;
  finish2Desc?: string;
  finish2DescColor?: string;
  finish2DescFont?: string;
  finish2DescSize?: string;
  finish3Name?: string;
  finish3Image?: string;
  finish3Desc?: string;
  finish3DescColor?: string;
  finish3DescFont?: string;
  finish3DescSize?: string;
  finish4Name?: string;
  finish4Image?: string;
  finish4Desc?: string;
  finish4DescColor?: string;
  finish4DescFont?: string;
  finish4DescSize?: string;
  finish5Name?: string;
  finish5Image?: string;
  finish5Desc?: string;
  finish5DescColor?: string;
  finish5DescFont?: string;
  finish5DescSize?: string;
}

export default function FinishesSection({
  heading,
  headingColor,
  headingFont,
  headingSize,
  finish1Name,
  finish1Image,
  finish1Desc,
  finish1DescColor,
  finish1DescFont,
  finish1DescSize,
  finish2Name,
  finish2Image,
  finish2Desc,
  finish2DescColor,
  finish2DescFont,
  finish2DescSize,
  finish3Name,
  finish3Image,
  finish3Desc,
  finish3DescColor,
  finish3DescFont,
  finish3DescSize,
  finish4Name,
  finish4Image,
  finish4Desc,
  finish4DescColor,
  finish4DescFont,
  finish4DescSize,
  finish5Name,
  finish5Image,
  finish5Desc,
  finish5DescColor,
  finish5DescFont,
  finish5DescSize,
}: Props) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const content = [
    { name: finish1Name || defaults[0].name, img: finish1Image || defaults[0].img, desc: finish1Desc || defaults[0].desc, descColor: finish1DescColor, descFont: finish1DescFont, descSize: finish1DescSize },
    { name: finish2Name || defaults[1].name, img: finish2Image || defaults[1].img, desc: finish2Desc || defaults[1].desc, descColor: finish2DescColor, descFont: finish2DescFont, descSize: finish2DescSize },
    { name: finish3Name || defaults[2].name, img: finish3Image || defaults[2].img, desc: finish3Desc || defaults[2].desc, descColor: finish3DescColor, descFont: finish3DescFont, descSize: finish3DescSize },
    { name: finish4Name || defaults[3].name, img: finish4Image || defaults[3].img, desc: finish4Desc || defaults[3].desc, descColor: finish4DescColor, descFont: finish4DescFont, descSize: finish4DescSize },
    { name: finish5Name || defaults[4].name, img: finish5Image || defaults[4].img, desc: finish5Desc || defaults[4].desc, descColor: finish5DescColor, descFont: finish5DescFont, descSize: finish5DescSize },
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
        className={`${fontClass(headingFont, "font-ivymode")} ${headingSizeClass(headingSize, "text-[clamp(28px,4.5vw,66px)]")} ${colorClass(headingColor, "text-[#545759]")} tracking-[0.2em] text-center mb-[40px] uppercase`}
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
                        className={`absolute top-full left-0 ${fontClass(finish.descFont, "font-michroma")} max-w-full ml-8 md:ml-[45px] ${paragraphSizeClass(finish.descSize, "text-[clamp(14px,1.8vw,18px)]")} mt-4 pointer-events-none ${colorClass(finish.descColor, finish.darkText ? 'text-[#545759]' : 'text-white/80')}`}
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
