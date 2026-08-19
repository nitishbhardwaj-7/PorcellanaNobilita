"use client";

import React, { useState, useRef, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Lazy-loaded video component using IntersectionObserver to prevent loading/playing lag
function LazyVideo({ src, poster, className, controls = false, isParentReady = true }: { src: string; poster?: string; className?: string; controls?: boolean; isParentReady?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    setIsLoaded(false);
    hasStartedRef.current = false;
  }, [src]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      if (!video.src || video.src === "") {
        video.src = src;
        video.load();
      }

      if (isParentReady) {
        video.play().then(() => {
          if (!hasStartedRef.current) {
            video.currentTime = 0;
            hasStartedRef.current = true;
          }
        }).catch(() => {
          // Handle autoplay policy block
        });
      } else {
        video.pause();
        hasStartedRef.current = false;
      }
    } else {
      video.pause();
      hasStartedRef.current = false;
    }
  }, [isVisible, src, isParentReady]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {poster && (
        <img
          src={poster}
          alt="Video placeholder"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      <video
        ref={videoRef}
        preload="none"
        loop
        muted
        playsInline
        controls={controls}
        onLoadedData={() => setIsLoaded(true)}
        onPlay={() => setIsLoaded(true)}
        className={`${className} absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out z-10`}
        style={{
          opacity: isLoaded ? 1 : 0,
        }}
      />
    </div>
  );
}

interface SlabConfig {
  leftBg?: string;
  dimensions: string[];
  faces: string[];
  finishes: string[];
  slides: { type: "video" | "image"; src: string; poster?: string; alt?: string }[];
  bookmatchImg?: string;
  availableFaces?: string[];
  isHorizontalFace?: boolean;
  isDark?: boolean;
}

const PRODUCT_CONFIGS: Record<string, SlabConfig> = {
  "Arabescato Vagli": {
    leftBg: "/images/Links/Arabescato Vagli Face 1_1 - Copy.jpg",
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – BOOKMATCH OF 1", "12MM – BOOKMATCH OF 1"],
    finishes: ["6.5MM – POLISHED & HONED", "12MM – POLISHED & HONED"],
    slides: [
      { type: "video", src: "/images/Arbescato Vagli/arbescato vagli.mp4", poster: "/images/Links/Arabescato Vagli Face 1_1 - Copy.jpg", alt: "Arabescato Vagli Video" },
      { type: "image", src: "/images/Arbescato Vagli/Arbescato Vagli (2).jpg", alt: "Arabescato Vagli Slab 1" },
      { type: "image", src: "/images/Arbescato Vagli/Arabescato Vagli (2).jpg", alt: "Arabescato Vagli Slab 2" },
      { type: "image", src: "/images/Arbescato Vagli/Arabescato Vagli (4).jpg", alt: "Arabescato Vagli Slab 3" }
    ],
    bookmatchImg: "/images/Arbescato Vagli/Bookmatch.jpg",
    availableFaces: ["/images/Links/Arabescato Vagli Face 1_1 - Copy.jpg"],
    isHorizontalFace: true
  },
  "Calacatta Oyster": {
    leftBg: "/images/Links/Calacatta Oyster Face 1.jpg",
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1  2  3", "12MM – BOOKMATCH OF 2"],
    finishes: ["6.5MM – POLISHED & HONED", "12MM – POLISHED & HONED"],
    slides: [
      { type: "video", src: "/images/Links/Calacatta Oyster Vid.mp4", poster: "/images/Links/Calacatta Oyster Face 1.jpg", alt: "Calacatta Oyster Video" },
      { type: "image", src: "/images/Calacatta Oyster/Calacatta Oyster1.jpg", alt: "Calacatta Oyster Slab 1" },
      { type: "image", src: "/images/Calacatta Oyster/Calacatta Oyster (2).jpg", alt: "Calacatta Oyster Slab 2" }
    ],
    bookmatchImg: "/images/Calacatta Oyster/Bookmatch.jpg",
    availableFaces: [
      "/images/Links/Calacatta Oyster Face 1.jpg",
      "/images/Links/Calacatta Oyster Face 2.jpg",
      "/images/Links/Calacatta Oyster Face 3.jpg"
    ]
  },
  "Arabescato Fjord": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – MATTE", "12MM – MATTE"],
    slides: [
      { type: "image", src: "/images/Links/Arbescato Fjord Face 1.jpg", alt: "Arabescato Fjord Slab" }
    ],
    availableFaces: ["/images/Links/Arbescato Fjord Face 1.jpg"],
    isHorizontalFace: true
  },
  "Basaltina": {
    leftBg: "/images/Links/Basaltina matte.jpg",
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – HONED", "12MM – HONED"],
    slides: [
      { type: "image", src: "/images/NewImages/Basaltina.jpg", alt: "Basaltina Application" },
      { type: "image", src: "/images/Links/Basaltina face 1.jpg", alt: "Basaltina Slab" }
    ],
    availableFaces: ["/images/Links/Basaltina face 1.jpg"],
    isHorizontalFace: true,
    isDark: true
  },
  "Calacatta Borghini": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – BOOKMATCH OF 1"],
    finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Calacatta Borghini 1.jpg", alt: "Calacatta Borghini Video" },
      { type: "image", src: "/images/Links/Calacatta Borghini 1.jpg", alt: "Calacatta Borghini Slab" }
    ],
    availableFaces: ["/images/Links/Calacatta Borghini 1.jpg"]
  },
  "Calacatta Sponda": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Calacatta Sponda 1.jpg", alt: "Calacatta Sponda Video" },
      { type: "image", src: "/images/Links/Calacatta Sponda 1.jpg", alt: "Calacatta Sponda Slab" }
    ],
    availableFaces: ["/images/Links/Calacatta Sponda 1.jpg"]
  },
  "Calacatta Vagli Rosa": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Calacatta Vagli Rosa 1.jpg", alt: "Calacatta Vagli Rosa Video" },
      { type: "image", src: "/images/Links/Calacatta Vagli Rosa 1.jpg", alt: "Calacatta Vagli Rosa Slab" }
    ],
    availableFaces: ["/images/Links/Calacatta Vagli Rosa 1.jpg"]
  },
  "Crystallo Bianco": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – HONED", "12MM – HONED"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/crystallo bianco 1.jpg", alt: "Crystallo Bianco Video" },
      { type: "image", src: "/images/Links/crystallo bianco 1.jpg", alt: "Crystallo Bianco Slab" }
    ],
    availableFaces: ["/images/Links/crystallo bianco 1.jpg"]
  },
  "Fior Di Melo": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – MATTE", "12MM – MATTE"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Fior Di Melo Face 1.jpg", alt: "Fior Di Melo Video" },
      { type: "image", src: "/images/Links/Fior Di Melo Face 1.jpg", alt: "Fior Di Melo Slab" }
    ],
    availableFaces: ["/images/Links/Fior Di Melo Face 1.jpg"]
  },
  "Onice Bianco": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Onice Bianco 1.jpg", alt: "Onice Bianco Video" },
      { type: "image", src: "/images/Links/Onice Bianco 1.jpg", alt: "Onice Bianco Slab" }
    ],
    availableFaces: ["/images/Links/Onice Bianco 1.jpg"]
  },
  "Onice Black & White": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – BOOKMATCH OF 1"],
    finishes: ["6.5MM – 3D-5D MATTE", "12MM – 3D-5D MATTE"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Onice Black & White Face 1_1.jpg", alt: "Onice Black & White Video" },
      { type: "image", src: "/images/Links/Onice Black & White Face 1_1.jpg", alt: "Onice Black & White Slab" }
    ],
    availableFaces: ["/images/Links/Onice Black & White Face 1_1.jpg"],
    isDark: true
  },
  "Paonazzetto Inizio": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – MATTE", "12MM – MATTE"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Paonazzetto Inizio 1.jpg", alt: "Paonazzetto Inizio Video" },
      { type: "image", src: "/images/Links/Paonazzetto Inizio 1.jpg", alt: "Paonazzetto Inizio Slab" }
    ],
    availableFaces: ["/images/Links/Paonazzetto Inizio 1.jpg"]
  },
  "Macchia Vecchia Max": {
    leftBg: "/images/Macchia Vecchia Max.jpeg",
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
    slides: [
      { type: "image", src: "/images/Macchia Vecchia Max App.jpg", alt: "Macchia Vecchia Max Application" }
    ],
    availableFaces: ["/images/Macchia Vecchia Max.jpeg"]
  },
  "Statuario Ultimo": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – HONED", "12MM – HONED"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Statuario Ultimo 1.jpg", alt: "Statuario Ultimo Video" },
      { type: "image", src: "/images/Links/Statuario Ultimo 1.jpg", alt: "Statuario Ultimo Slab" }
    ],
    availableFaces: ["/images/Links/Statuario Ultimo 1.jpg"]
  },
  "Travertino Romano Classico Cross Cut": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – STRUCTURED MATTE", "12MM – STRUCTURED MATTE"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Travertino CC 1.jpg", alt: "Travertino Romano Classico Cross Cut Video" },
      { type: "image", src: "/images/Links/Travertino CC 1.jpg", alt: "Travertino Romano Classico Cross Cut Slab" }
    ],
    availableFaces: ["/images/Links/Travertino CC 1.jpg"]
  },
  "Travertino Romano Classico Vein Cut": {
    leftBg: "/images/Travertino vein cut.jpeg",
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – STRUCTURED MATTE", "12MM – STRUCTURED MATTE"],
    slides: [
      { type: "image", src: "/images/Travertino vein cut.jpeg", alt: "Travertino Romano Classico Vein Cut" }
    ],
    availableFaces: ["/images/Travertino vein cut.jpeg"]
  },
  "Venatino Betogli": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Venatino betogli 1.jpg", alt: "Venatino Betogli Video" },
      { type: "image", src: "/images/Links/Venatino betogli 1.jpg", alt: "Venatino Betogli Slab" }
    ],
    availableFaces: ["/images/Links/Venatino betogli 1.jpg"]
  },
  "White Camouflage": {
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
    finishes: ["6.5MM – STRUCTURED MATTE", "12MM – STRUCTURED MATTE"],
    slides: [
      { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/White Camouflage Face 1.jpg", alt: "White Camouflage Video" },
      { type: "image", src: "/images/Links/White Camouflage Face 1.jpg", alt: "White Camouflage Slab" }
    ],
    availableFaces: ["/images/Links/White Camouflage Face 1.jpg"]
  },
  "Verde Profondo": {
    leftBg: "/images/Verde profondo/Verde profondo rotate.jpg",
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)"],
    faces: ["6.5MM — 1 2 3"],
    finishes: ["6.5MM — POLISHED"],
    slides: [
      { type: "video", src: "/images/Verde profondo/Verde Profondo video.mp4", poster: "/images/Verde profondo/Verde profondo application.jpg", alt: "Verde Profondo Video" },
      { type: "image", src: "/images/Verde profondo/Verde profondo application.jpg", alt: "Verde Profondo Application" },
      { type: "image", src: "/images/Verde profondo/BZ-060139-AMB-1-riv.jpg", alt: "Verde Profondo Application 1" },
      { type: "image", src: "/images/Verde profondo/BZ-060139-AMB-2-riv.jpg", alt: "Verde Profondo Application 2" },
      { type: "image", src: "/images/Verde profondo/BZ-060139-AMB-1-PAV.jpg", alt: "Verde Profondo Application 3" }
    ],
    availableFaces: [
      "/images/Verde profondo/Verde profondo face 1.jpg",
      "/images/Verde profondo/Verde profondo face 2.jpg",
      "/images/Verde profondo/Verde profondo face 3.jpg"
    ],
    isHorizontalFace: true,
    isDark: true
  },
  "Ferro Industriale": {
    leftBg: "/images/Ferro Industriale/Ferro Industriale.jpg",
    dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
    faces: ["6.5MM — 1", "12MM — 1"],
    finishes: ["6.5MM — MATTE", "12MM — MATTE"],
    slides: [
      { type: "video", src: "/images/Ferro Industriale/ferro industirale video.mp4", poster: "/images/Ferro Industriale/Ferro Industriale (2).jpg", alt: "Ferro Industriale Video" },
      { type: "image", src: "/images/Ferro Industriale/Ferro Industriale (2).jpg", alt: "Ferro Industriale Application 2" },
      { type: "image", src: "/images/Ferro Industriale/Ferro Industriale (1).jpg", alt: "Ferro Industriale Application 1" },
      { type: "image", src: "/images/Ferro Industriale/Ferro Industriale (3).jpg", alt: "Ferro Industriale Application 3" }
    ],
    availableFaces: ["/images/Ferro Industriale/Ferro Industriale.jpg"],
    isHorizontalFace: true,
    isDark: true
  }
};

interface FeaturedProductProps {
  activeProduct?: string | null;
  onClose?: () => void;
}

function FeaturedProductContent({ activeProduct = null, onClose }: FeaturedProductProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);

  const [isOpenDone, setIsOpenDone] = useState(false);
  const isClosingRef = useRef(false);

  // Slider States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  // Bookmatch / Face States
  const [showBookmatch, setShowBookmatch] = useState(false);
  const [activeFace, setActiveFace] = useState<number>(1);

  // Get configuration for current active product dynamically from DB
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.data)) {
          setDbProducts(json.data);
        }
      })
      .catch((err) => console.error("Error fetching dynamic products in modal:", err));

    return () => {
      isMounted = false;
    };
  }, [activeProduct]);

  const config = useMemo<SlabConfig | null>(() => {
    if (!activeProduct) return null;

    const staticConfig = PRODUCT_CONFIGS[activeProduct] || null;
    const dbProduct = dbProducts.find(
      (p) =>
        p.name?.trim().toLowerCase() === activeProduct.trim().toLowerCase() ||
        p.slug?.trim().toLowerCase() === activeProduct.trim().toLowerCase()
    );

    let leftBg = dbProduct?.leftBg || dbProduct?.coverImage || staticConfig?.leftBg;
    let bookmatchImg = dbProduct?.bookmatchImg || staticConfig?.bookmatchImg;
    let isHorizontalFace = dbProduct?.isHorizontalFace ?? staticConfig?.isHorizontalFace ?? false;

    // Dimensions: Prioritize DB product dimensions if non-empty, then thicknessMm if provided, then staticConfig
    let dimensions: string[] = [];
    if (Array.isArray(dbProduct?.dimensions) && dbProduct.dimensions.length > 0) {
      dimensions = [...dbProduct.dimensions];
    } else if (Array.isArray(dbProduct?.thicknessMm) && dbProduct.thicknessMm.length > 0) {
      dimensions = dbProduct.thicknessMm.map((t: string, idx: number) => {
        const thicknessStr = t.toUpperCase().includes("MM") ? t.toUpperCase() : `${t}MM`;
        return `${thicknessStr} x 1600 x 3200${idx === 0 ? " (RECTIFIED)" : " (GROSS)"}`;
      });
    } else if (staticConfig?.dimensions && staticConfig.dimensions.length > 0) {
      dimensions = [...staticConfig.dimensions];
    } else {
      dimensions = ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"];
    }

    dimensions = dimensions.map(d =>
      d.replace(/\s*\(R\)/gi, " (RECTIFIED)")
       .replace(/\s*\(G\)/gi, " (GROSS)")
    );

    // Faces: Prioritize DB product faces if non-empty, then staticConfig
    let faces: string[] = [];
    if (Array.isArray(dbProduct?.faces) && dbProduct.faces.length > 0) {
      faces = [...dbProduct.faces];
    } else if (staticConfig?.faces && staticConfig.faces.length > 0) {
      faces = [...staticConfig.faces];
    } else if (Array.isArray(dbProduct?.availableFaces) && dbProduct.availableFaces.length > 0) {
      const thicknessStr = (dbProduct.thicknessMm && dbProduct.thicknessMm[0]) ? (dbProduct.thicknessMm[0].toUpperCase().includes("MM") ? dbProduct.thicknessMm[0].toUpperCase() : `${dbProduct.thicknessMm[0]}MM`) : "6.5MM";
      faces = [`${thicknessStr} – ${dbProduct.availableFaces.length} FACE${dbProduct.availableFaces.length > 1 ? "S" : ""}`];
    } else {
      faces = ["1 FACE"];
    }

    // Finishes: Prioritize DB product finishes if non-empty, then finish + thicknessMm, then staticConfig
    let finishes: string[] = [];
    if (Array.isArray(dbProduct?.finishes) && dbProduct.finishes.length > 0) {
      finishes = [...dbProduct.finishes];
    } else if (staticConfig?.finishes && staticConfig.finishes.length > 0) {
      finishes = [...staticConfig.finishes];
    } else if (dbProduct?.finish || (Array.isArray(dbProduct?.thicknessMm) && dbProduct.thicknessMm.length > 0)) {
      const finishName = (dbProduct.finish || "POLISHED").toUpperCase();
      if (Array.isArray(dbProduct.thicknessMm) && dbProduct.thicknessMm.length > 0) {
        finishes = dbProduct.thicknessMm.map((t: string) => {
          const thicknessStr = t.toUpperCase().includes("MM") ? t.toUpperCase() : `${t}MM`;
          return `${thicknessStr} – ${finishName}`;
        });
      } else {
        finishes = [finishName];
      }
    } else {
      finishes = ["POLISHED"];
    }

    // Slides
    let slides: { type: "video" | "image"; src: string; poster?: string; alt?: string }[] = [];
    const rawDbSlides = Array.isArray(dbProduct?.slides) ? dbProduct.slides : [];
    if (rawDbSlides.length > 0) {
      slides = rawDbSlides.map((s: any) => {
        if (typeof s === "string") {
          const isVideo = s.endsWith(".mp4") || s.endsWith(".webm");
          return { type: isVideo ? "video" : "image", src: s, alt: dbProduct?.name || activeProduct };
        }
        return s;
      });
    } else if (staticConfig?.slides && staticConfig.slides.length > 0) {
      slides = [...staticConfig.slides];
    }

    // Fallbacks if slides array is empty
    if (slides.length === 0) {
      if (dbProduct?.coverImage) {
        slides.push({ type: "image", src: dbProduct.coverImage, alt: activeProduct });
      }
      if (dbProduct && Array.isArray(dbProduct.gallery)) {
        dbProduct.gallery.forEach((img: string, i: number) => {
          if (img && img !== dbProduct.coverImage) {
            slides.push({ type: "image", src: img, alt: `${activeProduct} ${i + 1}` });
          }
        });
      }
      if (slides.length === 0 && leftBg) {
        slides.push({ type: "image", src: leftBg, alt: activeProduct });
      }
      if (slides.length === 0) {
        slides.push({ type: "image", src: "/images/Links/Arabescato Vagli Face 1_1 - Copy.jpg", alt: activeProduct });
      }
    }

    // Available Faces
    let availableFaces: string[] = [];
    const rawDbAvailableFaces = Array.isArray(dbProduct?.availableFaces) ? dbProduct.availableFaces : [];
    if (rawDbAvailableFaces.length > 0) {
      availableFaces = [...rawDbAvailableFaces];
    } else if (staticConfig?.availableFaces && staticConfig.availableFaces.length > 0) {
      availableFaces = [...staticConfig.availableFaces];
    } else if (leftBg || slides.length > 0) {
      availableFaces = [leftBg || slides[0].src];
    }

    if (!leftBg && slides.length > 0) {
      leftBg = slides[0].src;
    }

    const darkProductNames = ["basaltina", "onice black & white", "verde profondo", "ferro industriale"];
    const isDark =
      dbProduct?.isDark ??
      staticConfig?.isDark ??
      ((dbProduct?.name ? darkProductNames.includes(dbProduct.name.trim().toLowerCase()) : false) ||
       (activeProduct ? darkProductNames.includes(activeProduct.trim().toLowerCase()) : false));

    return {
      leftBg,
      dimensions,
      faces,
      finishes,
      slides,
      availableFaces,
      bookmatchImg,
      isHorizontalFace,
      isDark,
    };
  }, [dbProducts, activeProduct]);

  // Reset states on product change
  useEffect(() => {
    setCurrentSlide(0);
    setPrevSlideIndex(null);
    setSlideDirection("next");
    setShowBookmatch(false);
    setActiveFace(1);
    setIsOpenDone(false);
    isClosingRef.current = false;
  }, [activeProduct]);

  useEffect(() => {
    if (activeProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProduct]);

  useEffect(() => {
    if (!activeProduct) {
      setIsOpenDone(false);
      return;
    }

    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const backBtn = backBtnRef.current;
    const title = titleRef.current;
    const card = cardRef.current;

    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Set initial states
        gsap.set(overlayRef.current, { opacity: 0 });
        if (leftCol) {
          gsap.set(leftCol, {
            clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
            x: -50
          });
        }
        if (rightCol) {
          gsap.set(rightCol, {
            opacity: 0,
            x: 30
          });
        }
        if (backBtn) gsap.set(backBtn, { opacity: 0, scale: 0.8 });
        if (title) gsap.set(title, { opacity: 0, y: 30 });
        if (card) gsap.set(card, { opacity: 0, y: 35 });

        // Entry timeline
        const tl = gsap.timeline({
          onComplete: () => {
            setIsOpenDone(true);
            if (leftCol) {
              gsap.set(leftCol, { clipPath: "none" });
            }
          }
        });
        tl.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });

        if (leftCol) {
          tl.to(leftCol, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            x: 0,
            duration: 1.1,
            ease: "power4.inOut"
          }, "-=0.1");
        }

        if (rightCol) {
          tl.to(rightCol, {
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: "power3.out"
          }, leftCol ? "<" : "-=0.1");
        }

        if (backBtn) {
          tl.to(backBtn, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
          }, "-=0.6");
        }

        if (title) {
          tl.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          }, "-=0.5");
        }

        if (card) {
          tl.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          }, "-=0.6");
        }
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [activeProduct]);

  const handleClose = (onAfterClose?: () => void) => {
    // Guards against the close animation being kicked off twice (e.g. a rapid double
    // click/tap) — a second overlapping GSAP timeline on the same refs can prevent the
    // first timeline's onComplete from ever firing, which silently breaks navigation.
    if (!onClose || isClosingRef.current) return;
    isClosingRef.current = true;
    setIsOpenDone(false);

    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const backBtn = backBtnRef.current;
    const title = titleRef.current;
    const card = cardRef.current;

    // GSAP's default ticker runs on requestAnimationFrame, which browsers throttle or
    // fully pause on a backgrounded/hidden tab — onComplete could then be delayed far
    // longer than the animation's own duration, or never fire at all. `settle` is
    // guaranteed to run exactly once, either from the real animation finishing or from
    // the timeout fallback, so closing (and any follow-up like opening the query form)
    // never silently gets stuck.
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      isClosingRef.current = false;
      onClose();
      onAfterClose?.();
    };

    const tl = gsap.timeline({ onComplete: settle });

    const exitTargets = [card, title, backBtn].filter(Boolean);
    if (exitTargets.length > 0) {
      tl.to(exitTargets, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in"
      });
    }

    if (leftCol) {
      gsap.set(leftCol, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
      tl.to(leftCol, {
        clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        x: -30,
        duration: 0.8,
        ease: "power4.inOut"
      }, "-=0.2");
    }

    if (rightCol) {
      tl.to(rightCol, {
        opacity: 0,
        x: 20,
        duration: 0.8,
        ease: "power3.in"
      }, leftCol ? "<" : "-=0.2");
    }

    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in"
    }, "-=0.5");

    // Fallback in case the tab is backgrounded and rAF never ticks — timeline duration
    // is ~1.1s, so this only ever fires if the animation genuinely didn't complete.
    setTimeout(settle, 1500);
  };

  const nextSlide = () => {
    if (!config || !config.slides || config.slides.length <= 1) return;
    setSlideDirection("next");
    setPrevSlideIndex(currentSlide);
    setCurrentSlide((prev) => (prev + 1) % config.slides.length);
  };

  const prevSlide = () => {
    if (!config || !config.slides || config.slides.length <= 1) return;
    setSlideDirection("prev");
    setPrevSlideIndex(currentSlide);
    setCurrentSlide((prev) => (prev - 1 + config.slides.length) % config.slides.length);
  };

  // Slider GSAP Transitions
  useEffect(() => {
    if (prevSlideIndex === null || !slidesContainerRef.current || !config || !config.slides || config.slides.length <= 1) return;

    const children = slidesContainerRef.current.children;
    const activeChild = children[currentSlide] as HTMLElement;
    const prevChild = children[prevSlideIndex] as HTMLElement;

    if (!activeChild || !prevChild) return;

    // Set z-indices
    Array.from(children).forEach((child, idx) => {
      const el = child as HTMLElement;
      if (idx === currentSlide) {
        el.style.zIndex = "10";
      } else if (idx === prevSlideIndex) {
        el.style.zIndex = "5";
      } else {
        el.style.zIndex = "0";
      }
    });

    // Kill any ongoing tweens
    gsap.killTweensOf([activeChild, prevChild]);

    const isNext = slideDirection === "next";

    // Start states: active slide zooms in/out depending on navigation direction and fades in
    gsap.set(activeChild, {
      x: "0%",
      scale: isNext ? 1.15 : 0.85,
      opacity: 0,
      clipPath: "none",
      webkitClipPath: "none"
    });

    gsap.set(prevChild, {
      x: "0%",
      scale: 1,
      opacity: 1,
      clipPath: "none",
      webkitClipPath: "none"
    });

    // Animate active slide in (soft scale to normal & opacity fade)
    gsap.to(activeChild, {
      scale: 1,
      opacity: 1,
      duration: 1.3,
      ease: "power3.out"
    });

    // Animate prev slide out (soft scale away & opacity fade)
    gsap.to(prevChild, {
      scale: isNext ? 0.88 : 1.12,
      opacity: 0,
      duration: 1.3,
      ease: "power3.out"
    });
  }, [currentSlide, prevSlideIndex, slideDirection, config]);

  if (!activeProduct || !config) {
    return null;
  }

  // Get active face image path
  const activeFaceImg = config.availableFaces && config.availableFaces[activeFace - 1]
    ? config.availableFaces[activeFace - 1]
    : config.slides.find(s => s.type === "image")?.src || "";

  const content = (
    <div className="w-full flex flex-col bg-white">
      <Navbar forceVisible={true} />
      <section className="w-full min-h-screen flex flex-col lg:flex-row bg-white text-brand-dark relative font-ivymode">
        {/* Left Column: Spec Sheet with Slab Background */}
        <div
          ref={leftColRef}
          className="relative w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen pt-24 pb-8 px-4 md:pt-32 md:pb-16 md:px-16 flex flex-col justify-center lg:items-start items-center bg-brand-cream/10"
          style={{
            clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
            transform: "translateX(-50px)",
          }}
        >
          {/* Slab Background Image */}
          <div className="absolute inset-0">
            <img
              src={config.leftBg || config.slides.find(s => s.type === "image")?.src || ""}
              alt={`${activeProduct} Slab Background`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/10" />
          </div>

          {/* BACK button */}
          <div
            ref={backBtnRef}
            className="absolute top-24 left-6 md:top-28 md:left-12 z-50 pointer-events-auto"
            style={{ opacity: 0, transform: "scale(0.8)" }}
          >
            {onClose ? (
              <button
                onClick={() => handleClose()}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-brand-dark hover:border-brand-dark hover:bg-brand-dark text-brand-dark hover:text-white transition-all duration-300 focus:outline-none bg-white/[0.03] backdrop-blur-[1px] shadow-sm"
                aria-label="Go back"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 transition-transform duration-300 transform group-hover:-translate-x-0.5"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
            ) : (
              <Link
                href="/"
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-brand-dark hover:border-brand-dark hover:bg-brand-dark text-brand-dark hover:text-white transition-all duration-300 focus:outline-none bg-white/[0.03] backdrop-blur-[1px] shadow-sm"
                aria-label="Go back"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 transition-transform duration-300 transform group-hover:-translate-x-0.5"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </Link>
            )}
          </div>

          {/* Title */}
          <div
            ref={titleRef}
            className="relative z-10 w-full text-center lg:text-left mb-4 md:mb-12 mt-16 md:mt-20 lg:mt-8 lg:max-w-none"
            style={{ opacity: 0, transform: "translateY(30px)" }}
          >
            <h2 className="font-ivymode text-[clamp(28px,4.5vw,66px)] text-black tracking-[0.05em] uppercase font-light">
              {activeProduct}
            </h2>
          </div>

          {/* Specs Box Card - Solid White, exact sizes & alignments */}
          <div
            ref={cardRef}
            className="relative z-10 bg-white/70 p-4 md:p-8 w-full max-w-[550px] shadow-sm flex flex-col space-y-4 md:space-y-10"
            style={{ opacity: 0, transform: "translateY(35px)" }}
          >
            {/* Dimensions */}
            <div className="grid grid-cols-[auto_1fr] gap-x-3 md:gap-x-5 items-start">
              {/* Custom Dimensions SVG Icon */}
              <div className="w-8 h-6 md:w-12 md:h-8 flex items-center justify-start text-[#545759] opacity-100">
                <svg viewBox="2 5 25 18" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 md:w-10 h-auto">
                  <polyline points="2.34 8.36 23.12 8.36 23.12 22.54" />
                  <polyline points="5.54 11.33 2.34 8.36 5.54 5.39" />
                  <polyline points="26.1 19.35 23.12 22.54 20.15 19.35" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="font-ivymode text-[14px] md:text-[20px] text-black tracking-[0.05em] uppercase font-light h-6 md:h-8 flex items-center">
                  DIMENSIONS
                </h3>
                <div className="mt-1 md:mt-2">
                  <p className="font-michroma text-black uppercase tracking-[0.1em] leading-[1.8] text-[10px] sm:text-[12px] md:text-[14px]">
                    {config.dimensions.map((dim, i) => (
                      <span key={i} className="block whitespace-nowrap">
                        {dim}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            {/* Faces */}
            <div className="grid grid-cols-[auto_1fr] gap-x-3 md:gap-x-5 items-start">
              {/* Custom Faces SVG Icon */}
              <div className="w-8 h-6 md:w-12 md:h-8 flex items-center justify-start text-[#545759] opacity-100">
                <svg viewBox="2 9 24.5 11" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 md:w-10 h-auto">
                  <rect x="20.92" y="9.34" width="5.02" height="9.89" />
                  <rect x="11.66" y="9.34" width="5.02" height="9.89" />
                  <rect x="2.41" y="9.34" width="5.02" height="9.89" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="font-ivymode text-[14px] md:text-[20px] text-black tracking-[0.05em] uppercase font-light h-6 md:h-8 flex items-center">
                  FACES
                </h3>
                <div className="mt-1 md:mt-2">
                  <p className="font-michroma text-black uppercase tracking-[0.1em] leading-[1.8] text-[10px] sm:text-[12px] md:text-[14px]">
                    {config.faces.map((face, i) => (
                      <span key={i} className="block whitespace-nowrap">
                        {face}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            {/* Finishes */}
            <div className="grid grid-cols-[auto_1fr] gap-x-3 md:gap-x-5 items-start">
              {/* Custom Finishes SVG Icon */}
              <div className="w-8 h-6 md:w-12 md:h-8 flex items-center justify-start text-[#545759] opacity-100">
                <svg viewBox="2 10.8 24.5 7" fill="none" className="w-6 md:w-10 h-auto">
                  <defs>
                    <clipPath id="clippath-icon">
                      <rect x="2.16" y="10.82" width="24.03" height="6.7" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#clippath-icon)">
                    <path stroke="currentColor" strokeWidth="0.4" strokeLinejoin="round" d="M10,11.93L.92,2.86M10,13.45L-.59,2.86M10,14.96L-2.1,2.86M10,16.47L-3.61,2.86M10,17.98L-5.13,2.86M10,19.5L-6.64,2.86M10,21.01L-8.15,2.86M10,22.52L-9.66,2.86M10,24.03L-11.18,2.86M28.15,11.93L19.07,2.86M28.15,13.45L17.56,2.86M28.15,14.96L16.05,2.86M28.15,16.47L14.54,2.86M28.15,17.98L13.02,2.86M28.15,19.5L11.51,2.86M28.15,21.01L10,2.86M28.15,22.52L8.49,2.86M28.15,24.03L6.97,2.86M26.64,24.03L6.97,4.37M25.12,24.03L6.97,5.88M23.61,24.03L6.97,7.4M22.1,24.03L6.97,8.91M20.59,24.03L6.97,10.42M19.07,24.03L6.97,11.93M17.56,24.03L6.97,13.45M16.05,24.03L6.97,14.96M14.54,24.03l-7.56-7.56" />
                  </g>
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="font-ivymode text-[14px] md:text-[20px] text-black tracking-[0.05em] uppercase font-light h-6 md:h-8 flex items-center">
                  FINISHES
                </h3>
                <div className="mt-1 md:mt-2">
                  <p className="font-michroma text-black uppercase tracking-[0.1em] leading-[1.8] text-[10px] sm:text-[12px] md:text-[14px]">
                    {config.finishes.map((finish, i) => (
                      <span key={i} className="block whitespace-nowrap">
                        {finish}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Slider (Video & Images) */}
        <div
          ref={rightColRef}
          className="relative w-full lg:w-1/2 h-[50vh] lg:h-auto lg:min-h-screen bg-black flex items-center justify-center overflow-hidden group"
          style={{
            opacity: 0,
            transform: "translateX(30px)",
          }}
        >
          {/* Slides Container */}
          <div ref={slidesContainerRef} className="w-full h-full relative">
            {config.slides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              const isPrev = idx === prevSlideIndex;

              let zIndex = "z-0";
              let opacity = 0;

              if (isActive) {
                zIndex = "z-10";
                opacity = 1;
              } else if (isPrev) {
                zIndex = "z-5";
                opacity = 1;
              } else {
                zIndex = "z-0";
                opacity = 0;
              }

              return (
                <div
                  key={idx}
                  className={`absolute inset-0 w-full h-full ${zIndex}`}
                  style={{
                    opacity,
                    willChange: "transform, opacity",
                  }}
                >
                  {slide.type === "video" ? (
                    (isActive || isPrev) ? (
                      <LazyVideo
                        src={slide.src}
                        poster={slide.poster}
                        className="w-full h-full object-cover"
                        isParentReady={isActive}
                      />
                    ) : null
                  ) : (
                    <img
                      src={slide.src}
                      alt={slide.alt || `${activeProduct} slide ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Browse All Applications overlay text & slider buttons */}
          {config.slides.length > 1 && (
            <div className="absolute bottom-8 md:bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 md:space-x-8 drop-shadow-md">
              {/* Left Arrow Button */}
              <button
                onClick={prevSlide}
                className="text-white/70 hover:text-white transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 p-2 hover:scale-110 flex items-center justify-center"
                aria-label="Previous Slide"
              >
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 md:w-12 h-auto">
                  <path d="M40 6H2M2 6L7 1M2 6L7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <span className="font-michroma text-white tracking-[0.1em] md:tracking-[0.2em] text-[10px] md:text-sm uppercase whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded backdrop-blur-sm pointer-events-none">
                BROWSE ALL APPLICATIONS
              </span>

              {/* Right Arrow Button */}
              <button
                onClick={nextSlide}
                className="text-white/70 hover:text-white transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 p-2 hover:scale-110 flex items-center justify-center"
                aria-label="Next Slide"
              >
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 md:w-12 h-auto">
                  <path d="M0 6H38M38 6L33 1M38 6L33 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Enquire Button Section */}
      <section className="w-full bg-white flex justify-center pt-8 pb-8 md:pt-12 md:pb-12">
        <button
          type="button"
          onClick={() => {
            // Carries which product this enquiry is about into the query form (and from
            // there into the saved submission + notification email), so every product
            // enquiry is uniquely identifiable instead of a generic "contact us" message.
            const openQuery = () => {
              window.dispatchEvent(
                new CustomEvent("open-query-form", { detail: { product: activeProduct } })
              );
            };
            if (onClose) {
              // Fires once the close animation's own timeline actually completes (not a
              // guessed delay), then the query form's normal open-and-scroll-into-view
              // behavior takes over — identical to the Catalogue/Newsletter buttons.
              handleClose(openQuery);
            } else {
              openQuery();
            }
          }}
          className="relative overflow-hidden group border border-[#1a1a1a] px-10 py-3.5 font-michroma text-[clamp(12px,1.3vw,16px)] tracking-[0.25em] transition-colors duration-500 uppercase inline-flex items-center justify-center"
        >
          <span className="absolute -inset-[1px] bg-[#1a1a1a] scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
          <span className="relative z-10 text-[#1a1a1a] transition-colors duration-500 group-hover:text-white">
            ENQUIRE
          </span>
        </button>
      </section>

      {/* Face / Bookmatch Section */}
      <section className="w-full bg-white flex flex-col justify-center items-center pt-0 pb-10 md:pb-20 px-4 md:px-16">
        {(config.availableFaces || []).length > 1 ? (
          // Side-by-side layout for products with multiple faces
          showBookmatch && config.bookmatchImg ? (
            <div className="flex flex-col items-center w-full">
              {/* Bookmatch Image Container */}
              <div className="relative w-full max-w-[1100px] aspect-[1920/1872] overflow-hidden bg-brand-cream/5 shadow-sm border border-brand-dark/5 flex items-center justify-center">
                {/* Label inside top-center */}
                <div className={`absolute top-6 left-1/2 -translate-x-1/2 font-michroma font-medium text-[10px] md:text-[16px] tracking-[0.025em] ${config.isDark ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" : "text-[#1a1a1a]"} uppercase z-20 text-center whitespace-nowrap`}>
                  BOOKMATCH
                </div>

                <img
                  src={config.bookmatchImg}
                  alt={`${activeProduct} Bookmatch`}
                  className="w-full h-full object-contain block transition-all duration-700 ease-in-out z-10"
                />

                {/* BACK TO FACES button */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                  <button
                    onClick={() => setShowBookmatch(false)}
                    className={`border relative overflow-hidden group px-6 py-2 md:py-2.5 font-michroma font-medium text-[10px] md:text-[16px] tracking-[0.025em] uppercase focus:outline-none whitespace-nowrap ${config.isDark ? "border-white/40" : "border-brand-dark/40"}`}
                  >
                    <span className={`absolute -inset-[1px] scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100 ${config.isDark ? "bg-white" : "bg-brand-dark"}`} />
                    <span className={`relative z-10 transition-colors duration-500 ${config.isDark ? "text-white group-hover:text-neutral-900" : "text-brand-dark group-hover:text-white"}`}>
                      VIEW FACES
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Side-by-side Faces View */
            <div className="w-full flex flex-col items-center">
              <div className={`grid grid-cols-1 ${config.availableFaces?.length === 2 ? "md:grid-cols-2 max-w-[900px]" : "md:grid-cols-3 max-w-[1250px]"} gap-8 w-full justify-center`}>
                {(config.availableFaces || []).map((faceImg, idx) => {
                  const faceNum = idx + 1;
                  return (
                    <div key={faceNum} className="flex flex-col items-center w-full">
                      {/* Face Image Container */}
                      <div className="relative w-full aspect-[1/2] max-w-[360px] overflow-hidden bg-brand-cream/5 shadow-sm border border-brand-dark/5 flex items-center justify-center">
                        {/* Label inside top-center */}
                        <div className={`absolute top-6 left-1/2 -translate-x-1/2 font-michroma font-medium text-[10px] md:text-[16px] tracking-[0.025em] ${config.isDark ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" : "text-[#1a1a1a]"} uppercase z-20 text-center whitespace-nowrap`}>
                          FACE {faceNum}
                        </div>

                        <img
                          src={faceImg}
                          alt={`${activeProduct} Face ${faceNum}`}
                          className={
                            config.isHorizontalFace
                              ? "absolute inset-0 w-full h-full object-cover block transition-all duration-700 ease-in-out z-10"
                              : "absolute w-[200%] h-[50%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 object-cover origin-center block transition-all duration-700 ease-in-out z-10 max-w-none max-h-none"
                          }
                        />

                        {/* View Bookmatch button overlaid on face 2 */}
                        {faceNum === 2 && config.bookmatchImg && (
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full px-4 flex justify-center">
                            <button
                              onClick={() => setShowBookmatch(true)}
                              className={`border relative overflow-hidden group px-6 py-2 md:py-2.5 font-michroma font-medium text-[10px] md:text-[16px] tracking-[0.025em] uppercase focus:outline-none whitespace-nowrap ${config.isDark ? "border-white/40" : "border-brand-dark/40"}`}
                            >
                              <span className={`absolute -inset-[1px] scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100 ${config.isDark ? "bg-white" : "bg-brand-dark"}`} />
                              <span className={`relative z-10 transition-colors duration-500 ${config.isDark ? "text-white group-hover:text-neutral-900" : "text-brand-dark group-hover:text-white"}`}>
                                VIEW BOOKMATCH
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          // Original layout for all other products (e.g. Arabescato Vagli)
          <>
            <div className={`relative w-full overflow-hidden bg-brand-cream/5 shadow-sm border border-brand-dark/5 flex items-center justify-center transition-all duration-500 ${showBookmatch ? "max-w-[1100px] aspect-[1920/1872]" : "max-w-[1100px] aspect-[2/1]"
              }`}>
              {showBookmatch && config.bookmatchImg ? (
                <img
                  src={config.bookmatchImg}
                  alt={`${activeProduct} Bookmatch`}
                  className="w-full h-full object-contain block transition-all duration-700 ease-in-out z-10"
                />
              ) : (
                <img
                  src={activeFaceImg}
                  alt={`${activeProduct} Face ${activeFace}`}
                  className={
                    config.isHorizontalFace
                      ? "absolute w-full h-full object-cover block transition-all duration-700 ease-in-out z-10"
                      : "absolute w-1/2 aspect-[1/2] rotate-90 object-cover origin-center block transition-all duration-700 ease-in-out z-10"
                  }
                />
              )}

              {/* Label inside top-center */}
              <div className={`absolute top-6 left-1/2 -translate-x-1/2 font-michroma font-medium text-[10px] md:text-[16px] tracking-[0.025em] ${config.isDark ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" : "text-[#1a1a1a]"} uppercase z-20 text-center whitespace-nowrap`}>
                {showBookmatch ? "BOOKMATCH" : `FACE ${activeFace}`}
              </div>

              {/* Face switcher in top-right */}
              {config.availableFaces && config.availableFaces.length > 1 && (
                <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center space-x-2 md:space-x-3 z-20 hidden md:flex">
                  {config.availableFaces.map((f, idx) => {
                    const faceNum = idx + 1;
                    return (
                      <button
                        key={faceNum}
                        onClick={() => {
                          setActiveFace(faceNum);
                          setShowBookmatch(false);
                        }}
                        className={`border px-3 py-1.5 font-michroma text-[9px] md:text-[11px] tracking-[0.2em] uppercase transition-all duration-300 focus:outline-none ${activeFace === faceNum && !showBookmatch
                          ? "border-brand-dark bg-brand-dark text-white"
                          : "border-brand-dark/30 bg-white/85 text-[#545759] hover:border-brand-dark/60 hover:text-brand-dark"
                          }`}
                      >
                        FACE {faceNum}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* VIEW BOOKMATCH button in bottom-center */}
              {config.bookmatchImg && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                  <button
                    onClick={() => setShowBookmatch(!showBookmatch)}
                    className={`border relative overflow-hidden group px-6 py-2 md:py-2.5 font-michroma font-medium text-[10px] md:text-[16px] tracking-[0.025em] uppercase focus:outline-none whitespace-nowrap ${config.isDark ? "border-white/40" : "border-brand-dark/40"}`}
                  >
                    <span className={`absolute -inset-[1px] scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100 ${config.isDark ? "bg-white" : "bg-brand-dark"}`} />
                    <span className={`relative z-10 transition-colors duration-500 ${config.isDark ? "text-white group-hover:text-neutral-900" : "text-brand-dark group-hover:text-white"}`}>
                      {showBookmatch ? `VIEW FACE ${activeFace}` : "VIEW BOOKMATCH"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  );

  if (activeProduct) {
    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200000] overflow-y-auto bg-white"
        style={{ opacity: 0 }}
      >
        <div className="relative w-full min-h-screen bg-white">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export default function FeaturedProduct(props: FeaturedProductProps) {
  return (
    <Suspense fallback={null}>
      <FeaturedProductContent {...props} />
    </Suspense>
  );
}
