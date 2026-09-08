"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavigationOverlay from "@/components/NavigationOverlay";
import NewsletterPromoSection from "@/components/NewsletterPromoSection";
import FeaturedProduct from "@/components/FeaturedProduct";
import { NewsletterPost } from "@/lib/hardcodedNewsletters";

interface Props {
  post: NewsletterPost;
}

const applications = [
  { name: "INTERIOR WALLS", icon: "/images/Nobilita Newsletter/icons/icons/Untitled-1-01.png" },
  { name: "COUNTERTOPS", icon: "/images/Nobilita Newsletter/icons/icons/Untitled-1-02.png" },
  { name: "FACADES", icon: "/images/Nobilita Newsletter/icons/icons/Untitled-1-03.png" },
  { name: "FLOORING", icon: "/images/Nobilita Newsletter/icons/icons/Untitled-1-04.png" },
  { name: "FURNITURES", icon: "/images/Nobilita Newsletter/icons/icons/Untitled-1-05.png" },
];

export default function NewsletterDetailView({ post }: Props) {
  const [activeModalProduct, setActiveModalProduct] = useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const spec = post.productSpec;

  const handleCatalogDownload = () => {
    const link = document.createElement("a");
    link.href = "/Pdfs/CATALOGUE.pdf";
    link.download = "CATALOGUE.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.dispatchEvent(new CustomEvent("open-catalog-form"));
  };

  return (
    <div className="min-h-screen bg-white text-brand-dark flex flex-col justify-between overflow-x-hidden relative">
      <Navbar />

      {/* Navigation Overlay */}
      <NavigationOverlay isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* Section 1: Hero Deep Teal Banner (#007190) with Hamburger Menu, Back Arrow, NOBILITA Logo & Tag Graphic */}
      <section
        id="newsletter-hero"
        className="relative w-full bg-[#007190] text-white pt-28 pb-12 md:pt-32 md:pb-16 px-6 flex flex-col items-center justify-center text-center"
      >
        {/* Menu Hamburger Button on Top Left (Exact as Explore Collection) */}
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

        {/* Back Button Arrow — Positioned absolute inside Hero Section below Hamburger (Exact as Explore Collection) */}
        <Link
          href="/newsletter"
          className="absolute top-20 left-6 md:top-28 md:left-11 group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 hover:border-white/60 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-sm transition-all duration-300 focus:outline-none z-30"
          aria-label="Back to newsletters"
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

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col items-center max-w-4xl mx-auto space-y-6 md:space-y-8"
        >
          {/* Official NOBILITA_white Logo Image */}
          <div className="w-full max-w-[260px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[480px]">
            <img
              src="/images/NOBILITA_white.png"
              alt="Porcellana Nobilita"
              className="w-full h-auto object-contain block mx-auto"
            />
          </div>

          {/* Official Tag Graphic from /images/Links/tag.png */}
          <div className="w-full max-w-[380px] sm:max-w-[520px] md:max-w-[680px] lg:max-w-[800px] pt-2">
            <img
              src="/images/Links/tag.png"
              alt="Il Gres Imperiale d'Italia"
              className="w-full h-auto object-contain block mx-auto"
            />
          </div>
        </motion.div>
      </section>

      {/* Section 2: Pure White Subtitle Banner */}
      <section className="w-full bg-white text-brand-dark py-12 md:py-16 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto text-center"
        >
          <p className="font-ivymode font-light text-[clamp(22px,2.8vw,42px)] leading-[1.35] text-[#1a1a1a] tracking-normal">
            {post.subtitle || "A collection where timeless Italian elegance meets advanced porcelain technology."}
          </p>
        </motion.div>
      </section>

      {/* Section 3: Main Full-width / Max-width Hero Showcase Image */}
      <section className="w-full bg-white py-0 md:py-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-0 md:px-6 lg:px-12"
        >
          <div className="w-full overflow-hidden shadow-sm border-y md:border border-gray-200/60 bg-gray-50">
            <img
              src={post.heroImage}
              alt={post.heroImageAlt || post.title}
              className="w-full h-auto object-cover object-center block"
            />
          </div>
        </motion.div>
      </section>

      {/* Section 4: Specific Product Showcase Section (Top of Image aligns with Title, Bottom of Image aligns with Button) */}
      <section className="w-full bg-white text-brand-dark py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl lg:max-w-5xl mx-auto">
          {/* Flex Container with items-stretch so left image height matches right column exactly */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-12 lg:gap-16">
            {/* Left Column: Vertical Product Slab Image (Fills total height of right column) */}
            <div className="flex shrink-0 justify-center md:justify-end">
              <div className="w-full max-w-[280px] sm:max-w-[300px] md:w-[320px] lg:w-[360px] h-full flex overflow-hidden shadow-sm border border-gray-100/80">
                <img
                  src={spec.slabImage}
                  alt={spec.productName}
                  className="w-full h-full object-cover block"
                />
              </div>
            </div>

            {/* Right Column: Title (Top Aligned) + Specifications + View All Faces CTA (Bottom Aligned) */}
            <div className="flex flex-col justify-between py-0 text-left flex-1 max-w-xl">
              {/* Top: Product Title */}
              <div>
                <h2 className="font-ivymode text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a1a1a] tracking-wider uppercase leading-none mt-0">
                  {spec.productName}
                </h2>
              </div>

              {/* Middle: Specs Container with FeaturedProduct.tsx exact icons & larger typography */}
              <div className="space-y-6 md:space-y-8 py-6 md:py-4">
                {/* 1. DIMENSIONS */}
                <div className="grid grid-cols-[auto_1fr] gap-x-4 md:gap-x-6 items-start">
                  {/* Dimensions SVG Icon from FeaturedProduct.tsx */}
                  <div className="w-7 h-6 md:w-10 md:h-8 flex items-center justify-start text-[#545759] pt-1">
                    <svg viewBox="2 5 25 18" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 md:w-9 h-auto">
                      <polyline points="2.34 8.36 23.12 8.36 23.12 22.54" />
                      <polyline points="5.54 11.33 2.34 8.36 5.54 5.39" />
                      <polyline points="26.1 19.35 23.12 22.54 20.15 19.35" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-michroma text-sm md:text-base font-semibold tracking-widest text-[#1a1a1a] uppercase">
                      DIMENSIONS
                    </h3>
                    <div className="font-michroma text-[12px] sm:text-[14px] md:text-[16px] font-light text-gray-800 tracking-[0.1em] leading-[1.8] space-y-1 mt-1">
                      {spec.dimensions.map((dim, idx) => (
                        <p key={idx}>{dim}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. FACES */}
                <div className="grid grid-cols-[auto_1fr] gap-x-4 md:gap-x-6 items-start">
                  {/* Faces SVG Icon from FeaturedProduct.tsx */}
                  <div className="w-7 h-6 md:w-10 md:h-8 flex items-center justify-start text-[#545759] pt-1">
                    <svg viewBox="2 9 24.5 11" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 md:w-9 h-auto">
                      <rect x="20.92" y="9.34" width="5.02" height="9.89" />
                      <rect x="11.66" y="9.34" width="5.02" height="9.89" />
                      <rect x="2.41" y="9.34" width="5.02" height="9.89" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-michroma text-sm md:text-base font-semibold tracking-widest text-[#1a1a1a] uppercase">
                      FACES
                    </h3>
                    <div className="font-michroma text-[12px] sm:text-[14px] md:text-[16px] font-light text-gray-800 tracking-[0.1em] leading-[1.8] space-y-1 mt-1">
                      {spec.faces.map((face, idx) => (
                        <p key={idx}>{face}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. FINISHES */}
                <div className="grid grid-cols-[auto_1fr] gap-x-4 md:gap-x-6 items-start">
                  {/* Finishes SVG Icon from FeaturedProduct.tsx */}
                  <div className="w-7 h-6 md:w-10 md:h-8 flex items-center justify-start text-[#545759] pt-1">
                    <svg viewBox="2 10.8 24.5 7" fill="none" className="w-7 md:w-9 h-auto">
                      <defs>
                        <clipPath id="clippath-icon-newsletter-detail">
                          <rect x="2.16" y="10.82" width="24.03" height="6.7" />
                        </clipPath>
                      </defs>
                      <g clipPath="url(#clippath-icon-newsletter-detail)">
                        <path stroke="currentColor" strokeWidth="0.4" strokeLinejoin="round" d="M10,11.93L.92,2.86M10,13.45L-.59,2.86M10,14.96L-2.1,2.86M10,16.47L-3.61,2.86M10,17.98L-5.13,2.86M10,19.5L-6.64,2.86M10,21.01L-8.15,2.86M10,22.52L-9.66,2.86M10,24.03L-11.18,2.86M28.15,11.93L19.07,2.86M28.15,13.45L17.56,2.86M28.15,14.96L16.05,2.86M28.15,16.47L14.54,2.86M28.15,17.98L13.02,2.86M28.15,19.5L11.51,2.86M28.15,21.01L10,2.86M28.15,22.52L8.49,2.86M28.15,24.03L6.97,2.86M26.64,24.03L6.97,4.37M25.12,24.03L6.97,5.88M23.61,24.03L6.97,7.4M22.1,24.03L6.97,8.91M20.59,24.03L6.97,10.42M19.07,24.03L6.97,11.93M17.56,24.03L6.97,13.45M16.05,24.03L6.97,14.96M14.54,24.03l-7.56-7.56" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-michroma text-sm md:text-base font-semibold tracking-widest text-[#1a1a1a] uppercase">
                      FINISHES
                    </h3>
                    <div className="font-michroma text-[12px] sm:text-[14px] md:text-[16px] font-light text-gray-800 tracking-[0.1em] leading-[1.8] space-y-1 mt-1">
                      {spec.finishes.map((finish, idx) => (
                        <p key={idx}>{finish}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: CTA Button (Aligned to Bottom of Image) */}
              <div>
                <button
                  onClick={() => setActiveModalProduct(spec.productName)}
                  className="bg-[#007190] hover:bg-[#005c75] text-white font-michroma text-xs md:text-sm tracking-[0.2em] px-8 py-3.5 uppercase transition-colors duration-300 shadow-sm focus:outline-none mb-0"
                >
                  VIEW ALL FACES
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Inspiration Sentence */}
          <div className="mt-14 md:mt-20 pt-8 text-center border-t border-gray-100/80">
            <p className="font-ivymode font-light text-[clamp(18px,2.2vw,28px)] text-[#1a1a1a] leading-relaxed max-w-3xl mx-auto">
              {spec.inspirationLine1 || "Inspired by Italy's noble heritage and baroque architecture,"}
              <br className="hidden sm:block" />
              {" "}
              {spec.inspirationLine2 || "Porcellana NOBILITA is proudly made in Modena, Italy."}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Product Interactive Modal when clicking "VIEW ALL FACES" */}
      {activeModalProduct && (
        <FeaturedProduct
          activeProduct={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
        />
      )}

      {/* Section 5: Applications Teal Bar Section with PNG Icons */}
      <section className="w-full bg-[#007190] text-white py-10 md:py-12 border-t border-b border-white/10">
        <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-white/25">
            {applications.map((app, idx) => (
              <Link
                key={idx}
                href="/explore-collection"
                className="flex flex-col items-center justify-center p-4 md:p-6 group hover:bg-white/5 transition-colors duration-300"
              >
                <div className="h-12 md:h-16 lg:h-20 flex items-center justify-center mb-3">
                  <img
                    src={app.icon}
                    alt={app.name}
                    className="max-h-full w-auto object-contain block transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="font-michroma text-[clamp(12px,1.5vw,20px)] text-white tracking-[0.25em] uppercase font-light text-center">
                  {app.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Statuario Ultimo 1 Background Footer Strip (NOBILITA.COM + DOWNLOAD CATALOG) */}
      <section
        className="relative w-full bg-cover bg-center py-12 md:py-20 px-6 md:px-16 overflow-hidden"
        style={{ backgroundImage: "url('/images/Nobilita Newsletter/Links/Statuario Ultimo 1.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/25 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <Link
            href="/"
            className="font-michroma text-[clamp(12px,1.5vw,20px)] text-[#1a1a1a] tracking-[0.25em] font-light uppercase hover:opacity-75 transition-opacity"
          >
            NOBILITA.COM
          </Link>

          <button
            onClick={handleCatalogDownload}
            className="font-michroma text-[clamp(12px,1.5vw,20px)] text-[#1a1a1a] tracking-[0.25em] font-light uppercase hover:opacity-75 transition-opacity focus:outline-none cursor-pointer"
          >
            DOWNLOAD CATALOG
          </button>
        </div>
      </section>

      {/* Newsletter Promo & Footer */}
      <NewsletterPromoSection />
      <Footer />
    </div>
  );
}
