"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { colorClass, fontClass, headingSizeClass, paragraphSizeClass } from "@/lib/textStyle";

export interface HomeFinishTile {
  name: string;
  nameFont?: string | null;
  nameSize?: string | null;
  filterName: string;
  image: string;
  desc: string;
  descColor?: string | null;
  descFont?: string | null;
  descSize?: string | null;
  textStyle: string; // "dark" | "light"
  lightWash: boolean;
}

// Fallback tiles — used until Admin > Homepage > Finishes has tiles in the
// database (matches the original fixed five, same content and styling).
const defaultTiles: HomeFinishTile[] = [
  {
    name: "POLISHED",
    filterName: "Polished",
    image: "/images/Links/Onice Bianco 1.jpg",
    desc: "A glossy, reflective finish that brings out the full richness of the design for a luxurious look.",
    textStyle: "dark",
    lightWash: false,
  },
  {
    name: "MATTE",
    filterName: "Matte",
    image: "/images/Links/Basaltina matte.jpg",
    desc: "A non-reflective and refined finish, with added slip resistance.",
    textStyle: "light",
    lightWash: false,
  },
  {
    name: "HONED",
    filterName: "Honed",
    image: "/images/Links/Statuario Ultimo 1.jpg",
    desc: "A smooth, satin-like finish that balances subtle sheen with modern elegance.",
    textStyle: "dark",
    lightWash: false,
  },
  {
    name: "STRUCTURED MATTE",
    filterName: "Structured Matte",
    image: "/images/Links/White Camouflage Face 1 - Copy.jpg",
    desc: "Leather-inspired texture with subtle richness and enhanced grip.",
    textStyle: "dark",
    lightWash: true,
  },
  {
    name: "3D / 5D MATTE",
    filterName: "3D-5D Matte",
    image: "/images/Travertino Romano Classico Face 1 - Copy.jpg",
    desc: "A multi-dimensional finish that brings depth, texture, and realism to stone surfaces.",
    textStyle: "dark",
    lightWash: false,
  },
];

// A tile's textStyle/lightWash resolve to a text color plus an idle/hover
// overlay pair — the same three visual treatments the original fixed five
// tiles used between them.
function tileLook(tile: HomeFinishTile) {
  if (tile.textStyle === "light") {
    return { darkText: false, idleOverlay: "bg-black/25", hoverOverlay: "bg-black/10" };
  }
  if (tile.lightWash) {
    return { darkText: true, idleOverlay: "bg-white/25", hoverOverlay: "bg-white/35" };
  }
  return { darkText: true, idleOverlay: "bg-transparent", hoverOverlay: "bg-black/[0.03]" };
}

interface Props {
  heading?: string;
  headingColor?: string;
  headingFont?: string;
  headingSize?: string;
  tiles?: HomeFinishTile[];
}

export default function FinishesSection({
  heading,
  headingColor,
  headingFont,
  headingSize,
  tiles,
}: Props) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // CMS-managed tiles (Admin > Homepage > Finishes) win when present;
  // otherwise fall back to the bundled default five so the section never
  // renders empty.
  const finishes = (tiles && tiles.length > 0 ? tiles : defaultTiles).map((t) => ({
    ...t,
    ...tileLook(t),
  }));

  const handleFinishClick = (finish: (typeof finishes)[0]) => {
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
                src={finish.image}
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
                      className={`${fontClass(finish.nameFont, "font-didotbold")} font-medium uppercase ${paragraphSizeClass(finish.nameSize, "text-[clamp(14px,2.2vw,28px)]")} ${finish.darkText ? 'text-[#545759]' : 'text-white'
                        }`}
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
