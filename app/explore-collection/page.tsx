"use client";

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import NavigationOverlay from "@/components/NavigationOverlay";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const FeaturedProduct = dynamic(() => import("@/components/FeaturedProduct"), {
  ssr: false,
  loading: () => (
    <div className="w-full py-24 bg-white flex items-center justify-center font-michroma text-[9px] md:text-xs text-brand-dark/40 tracking-[0.2em] uppercase">
      Loading Exhibition...
    </div>
  )
});

// Comprehensive catalog of Nobilita luxury Italian porcelain slabs
const slabs = [
  {
    name: "Arabescato Vagli",
    img: "/images/Links/Arabescato Vagli Face 1_1 - Copy.jpg",
    color: "White",
    finish: "Polished"
  },
  {
    name: "Arabescato Fjord",
    img: "/images/Links/Arbescato Fjord Face 1.jpg",
    color: "White",
    finish: "Matte"
  },
  {
    name: "Basaltina",
    img: "/images/Links/Basaltina matte.jpg",
    color: "Green",
    finish: "Honed"
  },
  {
    name: "Calacatta Borghini",
    img: "/images/Links/Calacatta Borghini 1.jpg",
    color: "Beige",
    finish: "Polished"
  },
  {
    name: "Calacatta Oyster",
    img: "/images/Links/Calacatta Oyster Face 1.jpg",
    color: "White",
    finish: "3D-5D Matte"
  },
  {
    name: "Calacatta Sponda",
    img: "/images/Links/Calacatta Sponda 1.jpg",
    color: "White",
    finish: "Polished"
  },
  {
    name: "Calacatta Vagli Rosa",
    img: "/images/Links/Calacatta Vagli Rosa 1.jpg",
    color: "White",
    finish: "Polished"
  },
  {
    name: "Crystallo Bianco",
    img: "/images/Links/crystallo bianco 1.jpg",
    color: "White",
    finish: "Honed"
  },
  {
    name: "Fior Di Melo",
    img: "/images/Links/Fior Di Melo Face 1.jpg",
    color: "White",
    finish: "Matte"
  },
  {
    name: "Onice Bianco",
    img: "/images/Links/Onice Bianco 1.jpg",
    color: "White",
    finish: "Polished"
  },
  {
    name: "Onice Black & White",
    img: "/images/Links/Onice Black & White Face 1_1.jpg",
    color: "Green",
    finish: "3D-5D Matte"
  },
  {
    name: "Paonazzetto Inizio",
    img: "/images/Links/Paonazzetto Inizio 1.jpg",
    color: "White",
    finish: "Matte"
  },
  {
    name: "Macchia Vecchia Max",
    img: "/images/Macchia Vecchia Max.jpeg",
    color: "White",
    finish: "Polished"
  },
  {
    name: "Statuario Ultimo",
    img: "/images/Links/Statuario Ultimo 1.jpg",
    color: "White",
    finish: "Honed"
  },
  {
    name: "Travertino Romano Classico Cross Cut",
    img: "/images/Links/Travertino CC 1.jpg",
    color: "Beige",
    finish: "Structured Matte"
  },
  {
    name: "Travertino Romano Classico Vein Cut",
    img: "/images/Travertino vein cut.jpeg",
    color: "Beige",
    finish: "Structured Matte"
  },
  {
    name: "Venatino Betogli",
    img: "/images/Links/Venatino betogli 1.jpg",
    color: "White",
    finish: "Polished"
  },
  {
    name: "White Camouflage",
    img: "/images/Links/White Camouflage Face 1.jpg",
    color: "Grey",
    finish: "Structured Matte"
  },
  {
    name: "Verde Profondo",
    img: "/images/Verde profondo/Verde profondo rotate.jpg",
    color: "Green",
    finish: "Polished"
  },
  {
    name: "Ferro Industriale",
    img: "/images/Ferro Industriale/Ferro Industriale.jpg",
    color: "Grey",
    finish: "Matte"
  }
];

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const finishMetadata: Record<string, { name: string; img: string; desc: string }> = {
  "Polished": {
    name: "POLISHED",
    img: "/images/Links/Onice Bianco 1.jpg",
    desc: "A glossy and reflective surface that enhances depth, adding luxurious look."
  },
  "Matte": {
    name: "MATTE",
    img: "/images/Links/Basaltina matte.jpg",
    desc: "A non-reflective and refined finish, with added slip resistance."
  },
  "Honed": {
    name: "HONED",
    img: "/images/Links/Statuario Ultimo 1.jpg",
    desc: "A smooth, satin-like finish that balances subtle sheen with modern elegance."
  },
  "Structured Matte": {
    name: "STRUCTURED MATTE",
    img: "/images/Links/White Camouflage Face 1 - Copy.jpg",
    desc: "Leather-inspired texture with subtle richness and enhanced grip."
  },
  "3D-5D Matte": {
    name: "3D / 5D MATTE",
    img: "/images/Travertino Romano Classico Face 1 - Copy.jpg",
    desc: "A multi-dimensional finish that brings depth, texture, and realism to stone surfaces."
  }
};

const colors = ["White", "Beige", "Grey", "Green", "Brown"];
const finishes = ["Polished", "Matte", "Honed", "Structured Matte", "3D-5D Matte"];

function ExploreCollectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpenedFromSessionRef = useRef(false);

  const initialFinish = useMemo(() => {
    const finish = searchParams.get("finish");
    if (finish) {
      const matchedKey = Object.keys(finishMetadata).find(
        (key) => key.toLowerCase() === finish.toLowerCase()
      );
      return matchedKey || null;
    }
    return null;
  }, [searchParams]);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(initialFinish);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedFinish(initialFinish);
  }, [initialFinish]);

  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [finishDropdownOpen, setFinishDropdownOpen] = useState(false);

  // Grid column count state: 1, 2, 3, 4, or 5 columns
  const [columns, setColumns] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleZoomIn = () => {
    if (isMobile) {
      setColumns(1);
    } else {
      setColumns(c => Math.max(c - 1, 1));
    }
  };

  const handleZoomOut = () => {
    if (isMobile) {
      setColumns(2);
    } else {
      setColumns(c => Math.min(c + 1, 5));
    }
  };

  // Dynamic products list — the database is the source of truth. `slabs` above only
  // serves as an offline/error fallback and as legacy image/behavior lookup by name.
  const [dbProducts, setDbProducts] = useState<any[] | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (!isMounted) return;

        if (json.success && Array.isArray(json.data)) {
          const published = json.data
            .filter((p: any) => p.status === "PUBLISHED")
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .map((p: any) => {
              const staticMatch = slabs.find(s => s.name.toLowerCase() === p.name.toLowerCase());
              // Prefer whatever the admin has set on the product itself — that's what
              // makes edits (e.g. swapping a cover image) actually show up here.
              const firstSlideSrc = Array.isArray(p.slides) && p.slides.length > 0
                ? (typeof p.slides[0] === "string" ? p.slides[0] : p.slides[0]?.src)
                : "";
              const img =
                (p.coverImage && !p.coverImage.includes("Our story") ? p.coverImage : "") ||
                p.leftBg ||
                (Array.isArray(p.gallery) && p.gallery[0]) ||
                firstSlideSrc ||
                staticMatch?.img ||
                "";
              return {
                name: p.name,
                img,
                color: p.color,
                finish: p.finish || "",
                isDark: !!p.isDark
              };
            });
          setDbProducts(published);
        } else {
          setDbProducts(slabs);
        }
      } catch (err) {
        console.error("Failed to load dynamic products on explore-collection page:", err);
        if (isMounted) setDbProducts(slabs);
      } finally {
        if (isMounted) setProductsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const slabsToRender = useMemo(() => {
    return dbProducts ?? [];
  }, [dbProducts]);

  // Selected slab for fullscreen detail modal
  const [activeSlab, setActiveSlab] = useState<typeof slabs[0] | null>(null);

  const [isNavOpen, setIsNavOpen] = useState(false);

  // Auto-open active slab based on query parameter
  useEffect(() => {
    const productName = searchParams?.get("product");
    if (productName) {
      const foundSlab = slabsToRender.find(
        (slab) => slab.name.toLowerCase() === productName.toLowerCase()
      );
      if (foundSlab) {
        setActiveSlab(foundSlab);
      }
    } else {
      setActiveSlab(null);
    }
  }, [searchParams, slabsToRender]);

  const handleProductSelect = (slab: typeof slabsToRender[0]) => {
    isOpenedFromSessionRef.current = true;
    const params = new URLSearchParams(searchParams.toString());
    params.set("product", slab.name);
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

  // Reset all active filters
  const handleReset = () => {
    setSelectedColor(null);
    setSelectedFinish(null);
    setSearchTerm("");
    setColorDropdownOpen(false);
    setFinishDropdownOpen(false);
  };

  // Filter slabs based on selection
  const filteredSlabs = useMemo(() => {
    return slabsToRender.filter((slab) => {
      const matchColor = !selectedColor || slab.color === selectedColor;
      const matchFinish = !selectedFinish || slab.finish === selectedFinish;
      const matchSearch = !searchTerm || slab.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchColor && matchFinish && matchSearch;
    });
  }, [selectedColor, selectedFinish, searchTerm, slabsToRender]);

  // Tailwind Grid Columns classes map
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2 md:grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
  }[columns as 1 | 2 | 3 | 4 | 5] || "grid-cols-2 md:grid-cols-4";

  return (
    <div className="min-h-screen bg-white text-brand-dark flex flex-col justify-between overflow-x-hidden font-ivymode relative">
      {/* Global Scroll Navbar */}
      <Navbar />

      {/* Explore Collection Header Banner */}
      <div id="explore-hero" className="w-full bg-[#007190] pt-32 md:pt-28 pb-12 px-6 flex flex-col items-center justify-center text-center relative">
        {/* Menu Icon on Top Left */}
        <div className="absolute top-6 left-6 md:top-8 md:left-12 z-[10000]">
          <button
            onClick={() => setIsNavOpen(true)}
            className={`relative w-10 h-10 focus:outline-none transition-opacity hover:opacity-80 flex items-center justify-center ${
              isNavOpen ? "invisible" : ""
            }`}
            aria-label="Toggle navigation menu"
          >
            <span
              className="absolute block h-[2px] w-12 bg-white transition-all duration-300 ease-in-out"
              style={{
                transform: "translateY(-6px) rotate(0deg)"
              }}
            />
            <span
              className="absolute block h-[2px] w-12 bg-white transition-all duration-300 ease-in-out"
              style={{
                transform: "scaleX(1)",
                opacity: 1
              }}
            />
            <span
              className="absolute block h-[2px] w-12 bg-white transition-all duration-300 ease-in-out"
              style={{
                transform: "translateY(6px) rotate(0deg)"
              }}
            />
          </button>
        </div>

        {/* Navigation Overlay */}
        <NavigationOverlay isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

        <Link
          href="/"
          className="absolute top-20 left-6 md:top-28 md:left-11 group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 hover:border-white/60 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-sm transition-all duration-300 focus:outline-none"
          aria-label="Back to home"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 md:w-4.5 md:h-4.5 text-white/80 group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-0.5"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>

        <h1 className="font-ivymode text-white text-[clamp(17px,4.8vw,66px)] md:text-[clamp(28px,4.5vw,66px)] tracking-[0.04em] md:tracking-[0.10em] uppercase leading-tight py-1 mb-8 md:mb-12 whitespace-nowrap">
          EXPLORE THE COLLECTION
        </h1>

        <img
          src="/images/NOBILITA_white.png"
          alt="Porcellana Nobilita"
          className="h-10 md:h-36 w-auto object-contain"
        />
      </div>

      {/* Filters & Grid Adjustment Row */}
      <div className="w-full px-3 sm:px-6 md:px-12 py-4 md:py-5 border-b border-brand-dark/10 bg-white flex flex-col sticky top-[64px] md:top-[76px] z-30 shadow-sm">
        <div className="w-full flex items-center justify-between">
          {/* Left Side: Filter Options */}
          <div className="flex items-center gap-3 sm:gap-6 md:gap-10">
            {/* Color Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setColorDropdownOpen(!colorDropdownOpen);
                  setFinishDropdownOpen(false);
                }}
                className={`group font-michroma text-[11px] md:text-lg tracking-[0.15em] hover:text-brand-dark transition-colors uppercase flex items-center gap-2 select-none relative pb-1 ${selectedColor ? "text-[#007190] border-b border-[#007190]" : "text-[#545759]"
                  }`}
              >
                <span>COLOR{selectedColor && <span className="hidden md:inline"> ({selectedColor})</span>}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${colorDropdownOpen ? "rotate-180 text-[#007190]" : "rotate-0 group-hover:translate-y-0.5"}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <AnimatePresence>
                {colorDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-3 w-48 bg-white border border-brand-dark/10 shadow-xl z-40 py-2"
                  >
                    {colors.map((color, idx) => (
                      <motion.button
                        key={color}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => {
                          setSelectedColor(color);
                          setColorDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-michroma tracking-wider hover:bg-black/5 transition-colors uppercase ${selectedColor === color ? "text-[#007190] font-semibold" : "text-[#545759]"
                          }`}
                      >
                        {color}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Finish Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setFinishDropdownOpen(!finishDropdownOpen);
                  setColorDropdownOpen(false);
                }}
                className={`group font-michroma text-[11px] md:text-lg tracking-[0.15em] hover:text-brand-dark transition-colors uppercase flex items-center gap-2 select-none relative pb-1 ${selectedFinish ? "text-[#007190] border-b border-[#007190]" : "text-[#545759]"
                  }`}
              >
                <span>FINISH{selectedFinish && <span className="hidden md:inline"> ({selectedFinish})</span>}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${finishDropdownOpen ? "rotate-180 text-[#007190]" : "rotate-0 group-hover:translate-y-0.5"}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <AnimatePresence>
                {finishDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-3 w-56 bg-white border border-brand-dark/10 shadow-xl z-40 py-2"
                  >
                    {finishes.map((finish, idx) => (
                      <motion.button
                        key={finish}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => {
                          setSelectedFinish(finish);
                          setFinishDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-michroma tracking-wider hover:bg-black/5 transition-colors uppercase ${selectedFinish === finish ? "text-[#007190] font-semibold" : "text-[#545759]"
                          }`}
                      >
                        {finish}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reset Filter Button (Desktop only) */}
            {(selectedColor || selectedFinish || searchTerm) && (
              <button
                onClick={handleReset}
                className="hidden md:block font-michroma text-[11px] md:text-lg tracking-[0.15em] text-red-600 hover:text-red-700 transition-colors uppercase select-none"
              >
                RESET
              </button>
            )}
          </div>

          {/* Right Side: Search and Grid Controls */}
          <div className="flex items-center gap-2 sm:gap-6 md:gap-10">
            {/* Search Input field in same square format */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className={`border focus:border-[#007190] pl-3 pr-9 py-1.5 md:pl-4 md:pr-10 md:py-2 font-ivymode text-[11px] md:text-sm tracking-wide bg-transparent outline-none transition-all duration-300 w-32 sm:w-40 md:w-80 h-8 md:h-11 ${
                  searchTerm 
                    ? "border-[#007190] placeholder-[#007190] text-[#007190]" 
                    : "border-[#545759]/20 placeholder-[#545759] text-[#545759]"
                }`}
              />
              <div className={`absolute right-3 pointer-events-none transition-colors duration-300 ${
                searchTerm ? "text-[#007190]" : "text-[#545759]"
              }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 md:w-4.5 md:h-4.5"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            {/* Grid Columns Stack Selector */}
            <div className="flex flex-col items-center select-none bg-white md:rounded">
              <button
                onClick={handleZoomIn}
                className="px-2 md:px-3 text-[18px] md:text-[25px] lg:text-[25px] font-semibold md:hover:bg-brand-dark/5 transition-colors focus:outline-none leading-none py-0.5 md:py-0"
                aria-label="Decrease columns (Zoom in)"
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className="px-2 md:px-3 text-[18px] md:text-[25px] lg:text-[25px] font-semibold md:hover:bg-brand-dark/5 transition-colors focus:outline-none leading-none py-0.5 md:py-0"
                aria-label="Increase columns (Zoom out)"
              >
                -
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-only Reset Button Row */}
        {(selectedColor || selectedFinish || searchTerm) && (
          <div className="w-full flex justify-center mt-3 md:hidden border-t border-brand-dark/5 pt-2">
            <button
              onClick={handleReset}
              className="font-michroma text-[11px] tracking-[0.15em] text-red-600 hover:text-red-700 transition-colors uppercase select-none"
            >
              RESET
            </button>
          </div>
        )}
      </div>

      {/* Slabs Grid Section */}
      <div className="flex-1 w-full p-3 md:p-6 bg-white">
        {productsLoading ? (
          <div className={`grid ${gridColsClass} gap-3 md:gap-4`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-brand-cream/30 animate-pulse" />
            ))}
          </div>
        ) : (
        <div className={`grid ${gridColsClass} gap-3 md:gap-4`}>
          <AnimatePresence>
            {filteredSlabs.map((slab, index) => {
               const isWhiteTextSlab = (slab as any).isDark || slab.color === "Dark" || slab.name.toLowerCase() === "verde profondo" || slab.name.toLowerCase() === "ferro industriale";
              const shouldRotate = 
                slab.name.toLowerCase() === "calacatta borghini" || 
                slab.name.toLowerCase() === "calacatta sponda" ||
                slab.name.toLowerCase() === "calacatta vagli rosa" ||
                slab.name.toLowerCase() === "onice black & white" ||
                slab.name.toLowerCase() === "paonazzetto inizio" ||
                slab.name.toLowerCase() === "travertino romano classico cross cut" ||
                slab.name.toLowerCase() === "travertino romano classico vein cut" ||
                slab.name.toLowerCase() === "macchia vecchia max" ||
                slab.name.toLowerCase() === "venatino betogli";
              return (
                <motion.div
                  key={slab.name}
                  initial={{ y: 15 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "20px" }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: (index % 4) * 0.03 }}
                  onClick={() => handleProductSelect(slab)}
                  className="relative aspect-[4/3] group overflow-hidden border border-brand-dark/5 cursor-pointer bg-brand-cream/10"
                >
                  {/* Slab Image Wrapper with overflow-hidden */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img
                      src={slab.img}
                      alt={slab.name}
                      loading="lazy"
                      className={
                        shouldRotate
                          ? "absolute h-[200%] aspect-[1/2] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover transform-gpu transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.08]"
                          : "absolute inset-0 w-full h-full object-cover transform-gpu transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.08]"
                      }
                      style={{
                        transform: shouldRotate
                          ? "translate3d(-50%, -50%, 0) rotate(90deg)"
                          : "translate3d(0,0,0)",
                        backfaceVisibility: "hidden",
                        willChange: "transform"
                      }}
                    />

                    {/* Wipe Reveal Mask (Right to Left) */}
                    <motion.div
                      initial={{ x: "0%" }}
                      whileInView={{ x: "-100%" }}
                      viewport={{ once: true, margin: "20px" }}
                      transition={{
                        duration: 0.9,
                        ease: [0.76, 0, 0.24, 1],
                        delay: (index % 4) * 0.05
                      }}
                      className="absolute inset-0 bg-white z-20 pointer-events-none"
                    />
                  </div>

                  {/* Content Overlay - Name & Premium Icon */}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 z-20 flex items-end justify-between pointer-events-none select-none">
                    {/* Slab Name */}
                    <div className="overflow-hidden flex-1 mr-4">
                      <h3 className={`font-ivymode ${isWhiteTextSlab ? 'text-white drop-shadow-md' : 'text-brand-dark'} text-[16px] md:text-[22px] tracking-[0.06em] uppercase transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[700ms] ease-[cubic-bezier(0.25,1,0.5,1)]`}>
                        {slab.name}
                      </h3>
                    </div>

                    {/* Premium Icon (Diagonal Arrow) reveal */}
                    <div className="overflow-hidden flex-shrink-0">
                      <div className={`${isWhiteTextSlab ? 'text-white/90 drop-shadow-md' : 'text-brand-dark/90'} transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[700ms] ease-[cubic-bezier(0.25,1,0.5,1)] delay-[100ms]`}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 md:w-6 md:h-6 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        )}

        {!productsLoading && filteredSlabs.length === 0 && (
          <div className="w-full py-24 text-center">
            <p className="font-ivymode text-brand-dark/50 text-xl tracking-wider uppercase">
              {slabsToRender.length === 0
                ? "No Products Published Yet."
                : "No Slabs Match the Selected Filters."}
            </p>
            {(selectedColor || selectedFinish || searchTerm) && (
              <button
                onClick={handleReset}
                className="mt-4 relative overflow-hidden border border-[#545759] text-[#545759] bg-transparent px-8 py-2.5 font-michroma text-[clamp(12px,1.5vw,20px)] tracking-[0.25em] transition-colors duration-500 uppercase group focus:outline-none"
              >
                <span className="absolute inset-0 bg-[#545759] scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
                <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                  Clear Filters
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      <FeaturedProduct
        activeProduct={activeSlab?.name || null}
        onClose={handleProductClose}
      />
      <Footer />
    </div>
  );
}

export default function ExploreCollection() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-[#007190] flex items-center justify-center font-michroma text-[9px] md:text-xs text-white/50 tracking-[0.2em] uppercase">
        Loading Collection...
      </div>
    }>
      <ExploreCollectionContent />
    </Suspense>
  );
}
