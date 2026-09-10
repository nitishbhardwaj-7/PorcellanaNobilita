"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { colorClass, fontClass, headingSizeClass } from "@/lib/textStyle";

interface PrivacyCmsData {
  privacyHeroTitle?: string | null;
  privacyHeroTitleColor?: string | null;
  privacyHeroTitleFont?: string | null;
  privacyHeroTitleSize?: string | null;
  privacyHeroImage?: string | null;
  privacyIntro?: string | null;
  privacySec1Heading?: string | null;
  privacySec1Item1Heading?: string | null;
  privacySec1Item1Text?: string | null;
  privacySec1Item2Heading?: string | null;
  privacySec1Item2Text?: string | null;
  privacySec1Item3Heading?: string | null;
  privacySec1Item3Text?: string | null;
  privacySec2Heading?: string | null;
  privacySec2Intro?: string | null;
  privacySec2Item1?: string | null;
  privacySec2Item2?: string | null;
  privacySec2Item3?: string | null;
  privacySec2Item4?: string | null;
  privacySec2Item5?: string | null;
  privacySec3Heading?: string | null;
  privacySec3Text?: string | null;
  privacySec4Heading?: string | null;
  privacySec4Text?: string | null;
  privacySec5Heading?: string | null;
  privacySec5Text?: string | null;
  privacySec6Heading?: string | null;
  privacySec6Text?: string | null;
}

const bodyText = "text-[15px] sm:text-[16px] md:text-[18px] 2xl:text-[20px] tracking-widest leading-[1.8] font-light";
const h3Class = "font-ivymode font-light text-[#007190] text-[20px] md:text-[24px] tracking-[0.02em] mt-8 mb-3";
const h4Class = "font-ivymode font-light text-[#007190] text-[18px] md:text-[21px] tracking-[0.02em] mb-1.5";

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
            <p className={bodyText}>
              {d.privacyIntro || "At NOBILITA, we value your privacy. This Privacy Policy explains how we collect, use, disclose, and process your personal data when you use our website or otherwise interact with us."}
            </p>
          </motion.div>

          {/* Section 1: What Personal Data Do We Collect */}
          <motion.div variants={itemVariants}>
            <h3 className={h3Class}>{d.privacySec1Heading || "What Personal Data Do We Collect?"}</h3>
            <div className="space-y-5">
              <div>
                <h4 className={h4Class}>{d.privacySec1Item1Heading || "Contact Information:"}</h4>
                <p className={bodyText}>
                  {d.privacySec1Item1Text || "Your name, email address, phone number, and mailing address."}
                </p>
              </div>
              <div>
                <h4 className={h4Class}>{d.privacySec1Item2Heading || "Inquiry Information:"}</h4>
                <p className={bodyText}>
                  {d.privacySec1Item2Text || "Information you provide when you contact us with a question or request, such as the nature of your inquiry and any other information you choose to share."}
                </p>
              </div>
              <div>
                <h4 className={h4Class}>{d.privacySec1Item3Heading || "Website Usage Data:"}</h4>
                <p className={bodyText}>
                  {d.privacySec1Item3Text || "We may collect information about your use of our website, such as the pages you visit, the links you click, and the searches you perform."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 2: How Do We Use Your Personal Data */}
          <motion.div variants={itemVariants}>
            <h3 className={h3Class}>{d.privacySec2Heading || "How Do We Use Your Personal Data?"}</h3>
            <p className={`${bodyText} mb-3`}>
              {d.privacySec2Intro || "We use your personal data for the following purposes:"}
            </p>
            <ul className={`list-disc pl-6 space-y-2 ${bodyText}`}>
              <li>{d.privacySec2Item1 || "To respond to your inquiries and requests."}</li>
              <li>{d.privacySec2Item2 || "To process your orders and provide you with the services you request."}</li>
              <li>{d.privacySec2Item3 || "To send you marketing communications (with your consent)."}</li>
              <li>{d.privacySec2Item4 || "To analyze your use of our website and social media."}</li>
              <li>{d.privacySec2Item5 || "To comply with legal and regulatory obligations."}</li>
            </ul>
          </motion.div>

          {/* Section 3: Disclosure of Your Personal Data */}
          <motion.div variants={itemVariants}>
            <h3 className={h3Class}>{d.privacySec3Heading || "Disclosure of Your Personal Data"}</h3>
            <p className={bodyText}>
              {d.privacySec3Text || "We may disclose your personal data to law enforcement agencies or other government officials if required by law."}
            </p>
          </motion.div>

          {/* Section 4: Data Retention */}
          <motion.div variants={itemVariants}>
            <h3 className={h3Class}>{d.privacySec4Heading || "Data Retention"}</h3>
            <p className={bodyText}>
              {d.privacySec4Text || "We will retain your personal data for as long as necessary to fulfill the purposes for which it was collected, or as required by law."}
            </p>
          </motion.div>

          {/* Section 5: Security */}
          <motion.div variants={itemVariants}>
            <h3 className={h3Class}>{d.privacySec5Heading || "Security"}</h3>
            <p className={bodyText}>
              {d.privacySec5Text || "We take steps to protect your personal data from unauthorized access, disclosure, alteration, or destruction. However, no website or internet transmission is completely secure."}
            </p>
          </motion.div>

          {/* Section 6: Changes to this Privacy Policy */}
          <motion.div variants={itemVariants}>
            <h3 className={h3Class}>{d.privacySec6Heading || "Changes to this Privacy Policy"}</h3>
            <p className={bodyText}>
              {d.privacySec6Text || "We may update this Privacy Policy from time to time. We will post the updated Privacy Policy on our website."}
            </p>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
