"use client";

import React, { useState, useEffect } from "react";

const technicalImages = [
  { src: "/images/Links/Statuario Ultimo 1.jpg", name: "STATUARIO ULTIMO", textColor: "black" },
  { src: "/images/Links/Arbescato Fjord Face 1.jpg", name: "ARABESCATO FJORD", textColor: "black" },
  { src: "/images/Links/Arabescato Vagli Face 1_1.jpg", name: "ARABESCATO VAGLI", textColor: "black" },
  { src: "/images/Links/Calacatta Oyster Face 1.jpg", name: "CALACATTA OYSTER", textColor: "black" },
  { src: "/images/Links/Onice Black & White Face 1_1.jpg", name: "ONICE BLACK AND WHITE", textColor: "black" },
  { src: "/images/Links/Calacatta Sponda 1.jpg", name: "CALCATTA SPONDA", textColor: "black" },
  { src: "/images/Links/crystallo bianco 1.jpg", name: "CYSTALLO BIANCO", textColor: "black" },
  { src: "/images/Links/Fior Di Melo Face 1.jpg", name: "FIOR DI MELO", textColor: "black" },
  { src: "/images/Links/Onice Bianco 1.jpg", name: "ONICE BIANCO", textColor: "black" },
  { src: "/images/Links/Travertino CC 1.jpg", name: "TRAVERTINO ROMANO CLASSICO CROSS CUT", textColor: "black" }
]; export default function TechnicalDataSection() {
  const [{ current, prev }, setImageIndices] = useState({ current: 0, prev: null as number | null });

  useEffect(() => {
    technicalImages.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }, []);

  // Change image every 10 seconds (matches hero timing)
  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndices((state) => ({
        current: (state.current + 1) % technicalImages.length,
        prev: state.current
      }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="technical-data" className="relative w-full min-h-[60vh] overflow-hidden bg-brand-dark">
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden flex justify-center items-center">
        {technicalImages.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 w-full h-full transition-opacity duration-[1400ms] ease-in-out"
            style={{
              opacity: i === current || i === prev ? 1 : 0,
              zIndex: i === current ? 2 : (i === prev ? 1 : 0),
            }}
          >
            <img
              src={slide.src}
              alt={`${slide.name} technical view`}
              className="absolute inset-0 w-full h-full object-cover object-bottom max-w-none"
            />
            <div className="absolute bottom-2 right-3 md:bottom-2 md:right-3 z-20 pointer-events-none select-none text-right">
              <span
                className="font-ivymode tracking-[0.20em] text-[clamp(11px,1.2vw,16px)] uppercase font-light"
                style={{ color: slide.textColor === "white" ? "#ffffff" : "#000000" }}
              >
                {slide.name}
              </span>
            </div>
          </div>
        ))}
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />
        <div className="relative z-10 w-full max-w-6xl flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-48 px-6">
          <button onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("open-catalog-form"));
          }}
            className="relative overflow-hidden border border-[#545759] text-[#545759] bg-transparent px-8 py-2.5 font-michroma text-[clamp(12px,1.5vw,20px)] tracking-[0.25em] transition-colors duration-500 uppercase group min-w-[280px] md:min-w-[340px] text-center focus:outline-none">
            <span className="absolute -inset-[1px] bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
            <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
              CATALOGUE
            </span>
          </button>
          <button onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("open-newsletter-form"));
          }}
            className="relative overflow-hidden border border-[#545759] text-[#545759] bg-transparent px-8 py-2.5 font-michroma text-[clamp(12px,1.5vw,20px)] tracking-[0.25em] transition-colors duration-500 uppercase group min-w-[280px] md:min-w-[340px] text-center focus:outline-none">
            <span className="absolute -inset-[1px] bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
            <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
              NEWSLETTER
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
