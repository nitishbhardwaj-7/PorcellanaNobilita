"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { colorClass, fontClass, headingSizeClass, paragraphSizeClass } from "@/lib/textStyle";

interface PrivacyCmsData {
  privacyHeroTitle?: string | null;
  privacyHeroTitleColor?: string | null;
  privacyHeroTitleFont?: string | null;
  privacyHeroTitleSize?: string | null;
  privacyHeroImage?: string | null;
  privacyHeroLabel?: string | null;
  privacyHeroLabelColor?: string | null;
  privacyHeroLabelFont?: string | null;
  privacyHeroLabelSize?: string | null;
  privacyIntro?: string | null;
  privacyIntroColor?: string | null;
  privacyIntroFont?: string | null;
  privacyIntroSize?: string | null;
  privacySec1Heading?: string | null;
  privacySec1HeadingColor?: string | null;
  privacySec1HeadingFont?: string | null;
  privacySec1HeadingSize?: string | null;
  privacySec1Item1Heading?: string | null;
  privacySec1Item1HeadingColor?: string | null;
  privacySec1Item1HeadingFont?: string | null;
  privacySec1Item1HeadingSize?: string | null;
  privacySec1Item1Text?: string | null;
  privacySec1Item1TextColor?: string | null;
  privacySec1Item1TextFont?: string | null;
  privacySec1Item1TextSize?: string | null;
  privacySec1Item2Heading?: string | null;
  privacySec1Item2HeadingColor?: string | null;
  privacySec1Item2HeadingFont?: string | null;
  privacySec1Item2HeadingSize?: string | null;
  privacySec1Item2Text?: string | null;
  privacySec1Item2TextColor?: string | null;
  privacySec1Item2TextFont?: string | null;
  privacySec1Item2TextSize?: string | null;
  privacySec1Item3Heading?: string | null;
  privacySec1Item3HeadingColor?: string | null;
  privacySec1Item3HeadingFont?: string | null;
  privacySec1Item3HeadingSize?: string | null;
  privacySec1Item3Text?: string | null;
  privacySec1Item3TextColor?: string | null;
  privacySec1Item3TextFont?: string | null;
  privacySec1Item3TextSize?: string | null;
  privacySec2Heading?: string | null;
  privacySec2HeadingColor?: string | null;
  privacySec2HeadingFont?: string | null;
  privacySec2HeadingSize?: string | null;
  privacySec2Intro?: string | null;
  privacySec2IntroColor?: string | null;
  privacySec2IntroFont?: string | null;
  privacySec2IntroSize?: string | null;
  privacySec2Item1?: string | null;
  privacySec2Item1Color?: string | null;
  privacySec2Item1Font?: string | null;
  privacySec2Item1Size?: string | null;
  privacySec2Item2?: string | null;
  privacySec2Item2Color?: string | null;
  privacySec2Item2Font?: string | null;
  privacySec2Item2Size?: string | null;
  privacySec2Item3?: string | null;
  privacySec2Item3Color?: string | null;
  privacySec2Item3Font?: string | null;
  privacySec2Item3Size?: string | null;
  privacySec2Item4?: string | null;
  privacySec2Item4Color?: string | null;
  privacySec2Item4Font?: string | null;
  privacySec2Item4Size?: string | null;
  privacySec2Item5?: string | null;
  privacySec2Item5Color?: string | null;
  privacySec2Item5Font?: string | null;
  privacySec2Item5Size?: string | null;
  privacySec3Heading?: string | null;
  privacySec3HeadingColor?: string | null;
  privacySec3HeadingFont?: string | null;
  privacySec3HeadingSize?: string | null;
  privacySec3Text?: string | null;
  privacySec3TextColor?: string | null;
  privacySec3TextFont?: string | null;
  privacySec3TextSize?: string | null;
  privacySec4Heading?: string | null;
  privacySec4HeadingColor?: string | null;
  privacySec4HeadingFont?: string | null;
  privacySec4HeadingSize?: string | null;
  privacySec4Text?: string | null;
  privacySec4TextColor?: string | null;
  privacySec4TextFont?: string | null;
  privacySec4TextSize?: string | null;
  privacySec5Heading?: string | null;
  privacySec5HeadingColor?: string | null;
  privacySec5HeadingFont?: string | null;
  privacySec5HeadingSize?: string | null;
  privacySec5Text?: string | null;
  privacySec5TextColor?: string | null;
  privacySec5TextFont?: string | null;
  privacySec5TextSize?: string | null;
  privacySec6Heading?: string | null;
  privacySec6HeadingColor?: string | null;
  privacySec6HeadingFont?: string | null;
  privacySec6HeadingSize?: string | null;
  privacySec6Text?: string | null;
  privacySec6TextColor?: string | null;
  privacySec6TextFont?: string | null;
  privacySec6TextSize?: string | null;
}

// Per-field Color/Font/Size wiring — default (unset) values fall back to the
// page's original hardcoded design, exactly matching bodyText/h3Class/h4Class
// as they used to be before each field got its own style controls.
function bodyClass(color?: string | null, font?: string | null, size?: string | null) {
  return `${fontClass(font, "font-ivymode")} font-light ${colorClass(color, "text-[#545759]")} ${paragraphSizeClass(size, "text-[15px] sm:text-[16px] md:text-[18px] 2xl:text-[20px]")} tracking-widest leading-[1.8]`;
}
function h3ClassFor(color?: string | null, font?: string | null, size?: string | null) {
  return `${fontClass(font, "font-ivymode")} font-light ${colorClass(color, "text-[#007190]")} ${headingSizeClass(size, "text-[20px] md:text-[24px]")} tracking-[0.02em] mt-8 mb-3`;
}
function h4ClassFor(color?: string | null, font?: string | null, size?: string | null) {
  return `${fontClass(font, "font-ivymode")} font-light ${colorClass(color, "text-[#007190]")} ${headingSizeClass(size, "text-[18px] md:text-[21px]")} tracking-[0.02em] mb-1.5`;
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

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1],
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

        {/* Material label - bottom-right corner */}
        <div className="absolute bottom-2 right-3 md:bottom-2 md:right-3 z-20 pointer-events-none">
          <span
            className={`${fontClass(d.privacyHeroLabelFont, "font-ivymode")} font-light ${colorClass(d.privacyHeroLabelColor, "text-white")} uppercase tracking-[0.15em] ${paragraphSizeClass(d.privacyHeroLabelSize, "text-[clamp(11px,1.2vw,16px)]")} inline-block drop-shadow-md`}
          >
            {d.privacyHeroLabel || "BASALTINA"}
          </span>
        </div>
      </section>

      {/* Main Privacy Policy Content */}
      <main className="w-full flex-1 bg-white py-12 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24 font-ivymode text-[#545759] space-y-8"
        >
          {/* Intro */}
          <motion.div variants={itemVariants}>
            <p className={bodyClass(d.privacyIntroColor, d.privacyIntroFont, d.privacyIntroSize)}>
              {d.privacyIntro || "At NOBILITA, we value your privacy. This Privacy Policy explains how we collect, use, disclose, and process your personal data when you use our website or otherwise interact with us."}
            </p>
          </motion.div>

          {/* Section 1: What Personal Data Do We Collect */}
          <motion.div variants={itemVariants}>
            <h3 className={h3ClassFor(d.privacySec1HeadingColor, d.privacySec1HeadingFont, d.privacySec1HeadingSize)}>{d.privacySec1Heading || "What Personal Data Do We Collect?"}</h3>
            <div className="space-y-5">
              <div>
                <h4 className={h4ClassFor(d.privacySec1Item1HeadingColor, d.privacySec1Item1HeadingFont, d.privacySec1Item1HeadingSize)}>{d.privacySec1Item1Heading || "Contact Information:"}</h4>
                <p className={bodyClass(d.privacySec1Item1TextColor, d.privacySec1Item1TextFont, d.privacySec1Item1TextSize)}>
                  {d.privacySec1Item1Text || "Your name, email address, phone number, and mailing address."}
                </p>
              </div>
              <div>
                <h4 className={h4ClassFor(d.privacySec1Item2HeadingColor, d.privacySec1Item2HeadingFont, d.privacySec1Item2HeadingSize)}>{d.privacySec1Item2Heading || "Inquiry Information:"}</h4>
                <p className={bodyClass(d.privacySec1Item2TextColor, d.privacySec1Item2TextFont, d.privacySec1Item2TextSize)}>
                  {d.privacySec1Item2Text || "Information you provide when you contact us with a question or request, such as the nature of your inquiry and any other information you choose to share."}
                </p>
              </div>
              <div>
                <h4 className={h4ClassFor(d.privacySec1Item3HeadingColor, d.privacySec1Item3HeadingFont, d.privacySec1Item3HeadingSize)}>{d.privacySec1Item3Heading || "Website Usage Data:"}</h4>
                <p className={bodyClass(d.privacySec1Item3TextColor, d.privacySec1Item3TextFont, d.privacySec1Item3TextSize)}>
                  {d.privacySec1Item3Text || "We may collect information about your use of our website, such as the pages you visit, the links you click, and the searches you perform."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 2: How Do We Use Your Personal Data */}
          <motion.div variants={itemVariants}>
            <h3 className={h3ClassFor(d.privacySec2HeadingColor, d.privacySec2HeadingFont, d.privacySec2HeadingSize)}>{d.privacySec2Heading || "How Do We Use Your Personal Data?"}</h3>
            <p className={`${bodyClass(d.privacySec2IntroColor, d.privacySec2IntroFont, d.privacySec2IntroSize)} mb-3`}>
              {d.privacySec2Intro || "We use your personal data for the following purposes:"}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li className={bodyClass(d.privacySec2Item1Color, d.privacySec2Item1Font, d.privacySec2Item1Size)}>{d.privacySec2Item1 || "To respond to your inquiries and requests."}</li>
              <li className={bodyClass(d.privacySec2Item2Color, d.privacySec2Item2Font, d.privacySec2Item2Size)}>{d.privacySec2Item2 || "To process your orders and provide you with the services you request."}</li>
              <li className={bodyClass(d.privacySec2Item3Color, d.privacySec2Item3Font, d.privacySec2Item3Size)}>{d.privacySec2Item3 || "To send you marketing communications (with your consent)."}</li>
              <li className={bodyClass(d.privacySec2Item4Color, d.privacySec2Item4Font, d.privacySec2Item4Size)}>{d.privacySec2Item4 || "To analyze your use of our website and social media."}</li>
              <li className={bodyClass(d.privacySec2Item5Color, d.privacySec2Item5Font, d.privacySec2Item5Size)}>{d.privacySec2Item5 || "To comply with legal and regulatory obligations."}</li>
            </ul>
          </motion.div>

          {/* Section 3: Disclosure of Your Personal Data */}
          <motion.div variants={itemVariants}>
            <h3 className={h3ClassFor(d.privacySec3HeadingColor, d.privacySec3HeadingFont, d.privacySec3HeadingSize)}>{d.privacySec3Heading || "Disclosure of Your Personal Data"}</h3>
            <p className={bodyClass(d.privacySec3TextColor, d.privacySec3TextFont, d.privacySec3TextSize)}>
              {d.privacySec3Text || "We may disclose your personal data to law enforcement agencies or other government officials if required by law."}
            </p>
          </motion.div>

          {/* Section 4: Data Retention */}
          <motion.div variants={itemVariants}>
            <h3 className={h3ClassFor(d.privacySec4HeadingColor, d.privacySec4HeadingFont, d.privacySec4HeadingSize)}>{d.privacySec4Heading || "Data Retention"}</h3>
            <p className={bodyClass(d.privacySec4TextColor, d.privacySec4TextFont, d.privacySec4TextSize)}>
              {d.privacySec4Text || "We will retain your personal data for as long as necessary to fulfill the purposes for which it was collected, or as required by law."}
            </p>
          </motion.div>

          {/* Section 5: Security */}
          <motion.div variants={itemVariants}>
            <h3 className={h3ClassFor(d.privacySec5HeadingColor, d.privacySec5HeadingFont, d.privacySec5HeadingSize)}>{d.privacySec5Heading || "Security"}</h3>
            <p className={bodyClass(d.privacySec5TextColor, d.privacySec5TextFont, d.privacySec5TextSize)}>
              {d.privacySec5Text || "We take steps to protect your personal data from unauthorized access, disclosure, alteration, or destruction. However, no website or internet transmission is completely secure."}
            </p>
          </motion.div>

          {/* Section 6: Changes to this Privacy Policy */}
          <motion.div variants={itemVariants}>
            <h3 className={h3ClassFor(d.privacySec6HeadingColor, d.privacySec6HeadingFont, d.privacySec6HeadingSize)}>{d.privacySec6Heading || "Changes to this Privacy Policy"}</h3>
            <p className={bodyClass(d.privacySec6TextColor, d.privacySec6TextFont, d.privacySec6TextSize)}>
              {d.privacySec6Text || "We may update this Privacy Policy from time to time. We will post the updated Privacy Policy on our website."}
            </p>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
