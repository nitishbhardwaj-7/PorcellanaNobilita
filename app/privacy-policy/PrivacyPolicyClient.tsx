"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { colorClass, fontClass, headingSizeClass } from "@/lib/textStyle";
import { DEFAULT_PRIVACY_BODY } from "@/lib/privacyPolicyDefault";

interface PrivacyCmsData {
  privacyHeroTitle?: string | null;
  privacyHeroTitleColor?: string | null;
  privacyHeroTitleFont?: string | null;
  privacyHeroTitleSize?: string | null;
  privacyHeroImage?: string | null;
  privacyBody?: string | null;
}

export default function PrivacyPolicyPage({ cmsData }: { cmsData?: PrivacyCmsData | null }) {
  const d = cmsData || {};
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-brand-dark flex flex-col justify-between overflow-x-hidden relative">
      <Navbar />

      {/* Hero Banner with Title Overlay */}
      <section className="relative w-full overflow-hidden bg-white mt-[64px] md:mt-[80px]">
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

        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          src={d.privacyHeroImage || "/images/basaltina pool.png"}
          alt="Privacy Policy Background"
          className="w-full h-auto object-contain block"
        />

        {/* Title overlay - aligned to exact container bounds */}
        <div className="absolute inset-0 flex items-center z-20 pointer-events-none">
          <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className={`${fontClass(d.privacyHeroTitleFont, "font-ivymode")} font-light ${colorClass(d.privacyHeroTitleColor, "text-white")} uppercase tracking-[0.10em] ${headingSizeClass(d.privacyHeroTitleSize, "text-[clamp(36px,6.5vw,80px)]")} drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]`}
            >
              {d.privacyHeroTitle || "Privacy Policy"}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Main Privacy Policy Content — admin-editable HTML body (Admin >
          Homepage > Privacy Policy), defaults to the original hardcoded
          sections above so nothing changes until an admin edits it. */}
      <main className="w-full flex-1 bg-white py-12 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="privacy-content w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24 font-ivymode text-[#545759]"
          dangerouslySetInnerHTML={{ __html: d.privacyBody || DEFAULT_PRIVACY_BODY }}
        />
      </main>

      <style jsx global>{`
        .privacy-content > * + * {
          margin-top: 1.25rem;
        }
        .privacy-content p,
        .privacy-content li {
          font-family: var(--font-ivymode), serif;
          font-weight: 300;
          letter-spacing: 0.05em;
          line-height: 1.8;
          font-size: 15px;
        }
        .privacy-content h3 {
          font-family: var(--font-ivymode), serif;
          font-weight: 300;
          color: #007190;
          letter-spacing: 0.02em;
          font-size: 20px;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .privacy-content h4 {
          font-family: var(--font-ivymode), serif;
          font-weight: 300;
          color: #007190;
          letter-spacing: 0.02em;
          font-size: 18px;
          margin-bottom: 0.375rem;
        }
        .privacy-content ul {
          list-style: disc;
          padding-left: 1.5rem;
        }
        .privacy-content li {
          margin-bottom: 0.5rem;
        }
        @media (min-width: 640px) {
          .privacy-content p,
          .privacy-content li {
            font-size: 16px;
          }
        }
        @media (min-width: 768px) {
          .privacy-content p,
          .privacy-content li {
            font-size: 18px;
          }
          .privacy-content h3 {
            font-size: 24px;
          }
          .privacy-content h4 {
            font-size: 21px;
          }
        }
        @media (min-width: 1536px) {
          .privacy-content p,
          .privacy-content li {
            font-size: 20px;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}
