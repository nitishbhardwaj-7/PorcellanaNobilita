"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NobilitaHouseSVG from "./NobilitaHouseSVG";

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuLinks = [
  { label: "HOME", href: "/" },
  { label: "OUR STORY", href: "/our-story" },
  { label: "PRODUCTS", href: "/explore-collection" },
  { label: "TECHNICAL RESOURCES", href: "/technical-data" },
  { label: "MADE IN ITALY", href: "/made-in-italy" },
  { label: "CATALOGUE", href: "/#download-catalog" },
  { label: "BLOG", href: "/blog" },
  { label: "NEWSLETTER", href: "/newsletter" },
  { label: "CONTACT US", href: "/#contact-us" }
];

export default function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const handleLinkClick = (href: string) => {
    onClose();
    if (href === "/#contact-us") {
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        window.dispatchEvent(new CustomEvent("open-query-form"));
      }
    } else if (href === "/#download-catalog") {
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        window.dispatchEvent(new CustomEvent("open-catalog-form"));
      }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[99999] bg-[#007190] w-full h-[100dvh] md:h-full flex flex-col overflow-y-auto md:overflow-hidden"
        >
          {/* Top-Left Back Button */}
          <div className="absolute top-6 left-6 md:top-8 md:left-12 lg:top-10 lg:left-14 z-50">
            <button
              onClick={onClose}
              className="group flex items-center justify-center w-10 h-10 md:w-11 md:h-11 2xl:w-14 2xl:h-14 rounded-full border border-white/20 hover:border-white/60 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-sm transition-all duration-300 focus:outline-none"
              aria-label="Close menu"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 md:w-5 md:h-5 2xl:w-6 2xl:h-6 text-white/80 group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-0.5"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 w-full max-w-[1050px] xl:max-w-[1150px] 2xl:max-w-[1280px] mx-auto h-full relative px-6 pt-20 pb-8 md:px-12 md:py-10 2xl:py-14 content-center items-stretch gap-6 md:gap-12 2xl:gap-16">

            {/* Left Column: Links */}
            <div className="flex flex-col justify-between items-center md:items-start text-center md:text-left w-full h-full min-h-0">

              {/* Links container - centered with clean gaps on mobile, spaced out on desktop */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col justify-center md:justify-between items-center md:items-start w-full my-auto py-4 md:py-0 gap-6 sm:gap-7 md:gap-0"
              >
                {menuLinks.map((link) => (
                  <motion.div key={link.label} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => handleLinkClick(link.href)}
                      className="font-ivymode font-light text-white uppercase tracking-[0.16em] sm:tracking-[0.2em] hover:text-white/70 transition-all duration-300 text-[15px] sm:text-[18px] md:text-[clamp(15px,2.1vw,22px)] 2xl:text-[30px] leading-tight inline-block whitespace-nowrap"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Bottom: Mobile-only Logo */}
              <div className="block md:hidden shrink-0 pt-6 pb-4">
                <Link href="/" onClick={onClose} className="block w-[160px] sm:w-[180px] mx-auto cursor-pointer">
                  <img
                    src="/images/NOBILITA_white.png"
                    alt="Porcellana Nobilita"
                    className="w-full h-auto object-contain opacity-95"
                  />
                </Link>
              </div>
            </div>

            {/* Right Column: House & Logo (Desktop Only) */}
            <div className="hidden md:flex flex-col justify-between items-end w-full h-full">
              <div className="flex flex-col justify-between items-center h-full">
                {/* House drawing */}
                <div className="w-[220px] lg:w-[250px] 2xl:w-[320px] shrink-0">
                  <NobilitaHouseSVG
                    variant="white"
                    animate={isOpen}
                    className="opacity-90 w-full h-auto block"
                  />
                </div>

                {/* Logo block */}
                <Link href="/" onClick={onClose} className="block w-[209px] lg:w-[238px] 2xl:w-[304px] shrink-0 mt-6 md:mt-10 2xl:mt-14 cursor-pointer">
                  <img
                    src="/images/NOBILITA_white.png"
                    alt="Porcellana Nobilita"
                    className="w-full h-auto object-contain block"
                  />
                </Link>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
