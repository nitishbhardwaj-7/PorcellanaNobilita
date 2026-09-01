"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SitemapPage() {
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-brand-dark flex flex-col justify-between overflow-x-hidden relative">
      <Navbar />

      {/* Hero Banner with Title Overlay */}
      <section className="relative w-full aspect-[1536/643] overflow-hidden bg-white mt-[64px] md:mt-[80px]">
        {/* Back Button Arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-6 left-6 md:top-8 md:left-12 z-30"
        >
          <Link
            href="/"
            className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/30 hover:border-white/70 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 focus:outline-none"
            aria-label="Go back to home"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 md:w-4.5 md:h-4.5 text-white group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-0.5"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
        </motion.div>

        <div className="w-full h-full -scale-x-100 overflow-hidden">
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            src="/images/verde-alpi-full-sitemap-copy.jpg"
            alt="Sitemap Background"
            className="w-full h-full object-cover object-center block"
          />
        </div>

        {/* Title overlay - aligned to exact container bounds */}
        <div className="absolute inset-0 flex items-center z-20 pointer-events-none">
          <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="font-ivymode font-light text-white uppercase tracking-[0.10em] text-[clamp(36px,6.5vw,80px)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            >
              Sitemap
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Sitemap Tree Hierarchy */}
      <main className="w-full flex-1 bg-white py-12 md:py-20">
        <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24 font-ivymode text-[#545759]">
          <motion.ul
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 text-base md:text-lg tracking-widest leading-relaxed list-none"
          >
            {/* Profile / Our Story */}
            <motion.li variants={listItemVariants} className="flex flex-col gap-2">
              <div className="flex items-center gap-3.5 font-normal text-black text-lg md:text-xl lg:text-2xl">
                <span className="w-2 h-2 rounded-full bg-[#545759] shrink-0"></span>
                <Link href="/our-story" className="hover:text-[#007190] transition-colors">
                  Our Story
                </Link>
              </div>
            </motion.li>

            {/* Products */}
            <motion.li variants={listItemVariants} className="flex flex-col gap-4">
              <div className="flex items-center gap-3.5 font-normal text-black text-lg md:text-xl lg:text-2xl">
                <span className="w-2 h-2 rounded-full bg-[#545759] shrink-0"></span>
                <Link href="/explore-collection" className="hover:text-[#007190] transition-colors">
                  Products
                </Link>
              </div>
              <ul className="pl-8 md:pl-10 space-y-3.5 text-sm md:text-base lg:text-lg">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full border border-[#545759] shrink-0"></span>
                  <Link href="/explore-collection" className="hover:text-[#007190] transition-colors">
                    Arabescato Vagli
                  </Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full border border-[#545759] shrink-0"></span>
                  <Link href="/explore-collection" className="hover:text-[#007190] transition-colors">
                    Macchia Vecchia Max
                  </Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full border border-[#545759] shrink-0"></span>
                  <Link href="/explore-collection" className="hover:text-[#007190] transition-colors">
                    Calacatta Oyster
                  </Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full border border-[#545759] shrink-0"></span>
                  <Link href="/explore-collection" className="hover:text-[#007190] transition-colors">
                    Travertino Romano Classico Cross Cut
                  </Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full border border-[#545759] shrink-0"></span>
                  <Link href="/explore-collection" className="hover:text-[#007190] transition-colors">
                    Travertino Romano Classico Vein Cut
                  </Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full border border-[#545759] shrink-0"></span>
                  <Link href="/explore-collection" className="hover:text-[#007190] transition-colors">
                    Verde Profondo
                  </Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full border border-[#545759] shrink-0"></span>
                  <Link href="/explore-collection" className="hover:text-[#007190] transition-colors">
                    Fior Di Melo
                  </Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full border border-[#545759] shrink-0"></span>
                  <Link href="/explore-collection" className="hover:text-[#007190] transition-colors">
                    Ferro Industriale
                  </Link>
                </li>
              </ul>
            </motion.li>

      

            {/* Technical Data */}
            <motion.li variants={listItemVariants} className="flex flex-col gap-2">
              <div className="flex items-center gap-3.5 font-normal text-black text-lg md:text-xl lg:text-2xl">
                <span className="w-2 h-2 rounded-full bg-[#545759] shrink-0"></span>
                <Link href="/technical-data" className="hover:text-[#007190] transition-colors">
                  Technical Data
                </Link>
              </div>
            </motion.li>

            {/* Made in Italy */}
            <motion.li variants={listItemVariants} className="flex flex-col gap-2">
              <div className="flex items-center gap-3.5 font-normal text-black text-lg md:text-xl lg:text-2xl">
                <span className="w-2 h-2 rounded-full bg-[#545759] shrink-0"></span>
                <Link href="/made-in-italy" className="hover:text-[#007190] transition-colors">
                  Made in Italy
                </Link>
              </div>
            </motion.li>

            {/* Contact Us */}
            <motion.li variants={listItemVariants} className="flex flex-col gap-2">
              <div className="flex items-center gap-3.5 font-normal text-black text-lg md:text-xl lg:text-2xl">
                <span className="w-2 h-2 rounded-full bg-[#545759] shrink-0"></span>
                <Link href="/#contact-us" className="hover:text-[#007190] transition-colors">
                  Contact Us
                </Link>
              </div>
            </motion.li>

            {/* Blog */}
            <motion.li variants={listItemVariants} className="flex flex-col gap-2">
              <div className="flex items-center gap-3.5 font-normal text-black text-lg md:text-xl lg:text-2xl">
                <span className="w-2 h-2 rounded-full bg-[#545759] shrink-0"></span>
                <Link href="/blog" className="hover:text-[#007190] transition-colors">
                  Blog
                </Link>
              </div>
            </motion.li>

            {/* Newsletter */}
            <motion.li variants={listItemVariants} className="flex flex-col gap-2">
              <div className="flex items-center gap-3.5 font-normal text-black text-lg md:text-xl lg:text-2xl">
                <span className="w-2 h-2 rounded-full bg-[#545759] shrink-0"></span>
                <Link href="/newsletter" className="hover:text-[#007190] transition-colors">
                  Newsletter
                </Link>
              </div>
            </motion.li>

            {/* Privacy Policy */}
            <motion.li variants={listItemVariants} className="flex flex-col gap-2">
              <div className="flex items-center gap-3.5 font-normal text-black text-lg md:text-xl lg:text-2xl">
                <span className="w-2 h-2 rounded-full bg-[#545759] shrink-0"></span>
                <Link href="/privacy-policy" className="hover:text-[#007190] transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </motion.li>
          </motion.ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
