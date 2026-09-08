"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterPromoSection from "@/components/NewsletterPromoSection";

interface NewsletterCard {
  id: string;
  title: string;
  image: string;
  date: string;
  href: string;
}

const applications = [
  { name: "INTERIOR WALLS", icon: "/images/Nobilita Newsletter/icons/icons/Untitled-1-01.png" },
  { name: "COUNTERTOPS", icon: "/images/Nobilita Newsletter/icons/icons/Untitled-1-02.png" },
  { name: "FACADES", icon: "/images/Nobilita Newsletter/icons/icons/Untitled-1-03.png" },
  { name: "FLOORING", icon: "/images/Nobilita Newsletter/icons/icons/Untitled-1-04.png" },
  { name: "FURNITURES", icon: "/images/Nobilita Newsletter/icons/icons/Untitled-1-05.png" },
];

export default function NewsletterPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  // Bundled launch editions — permanent fallback content, same pattern as
  // HARDCODED_BLOGS for /blog. A CMS newsletter with the same slug (fetched
  // below) always wins over its hardcoded entry here.
  const hardcodedPosts: NewsletterCard[] = [
    {
      id: "macchia-vecchia-max",
      title: "MACCHIA VECCHIA MAX",
      image: "/images/Nobilita Newsletter/Links/Macchia Vecchia Max App.jpg",
      date: "2026-07-28",
      href: "/newsletter/macchia-vecchia-max",
    },
  ];

  const [newsletterPosts, setNewsletterPosts] = useState<NewsletterCard[]>(hardcodedPosts);

  useEffect(() => {
    let active = true;
    fetch("/api/newsletters")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const dbPosts: NewsletterCard[] = (data.data || [])
          .filter((n: any) => n.status === "PUBLISHED")
          .map((n: any) => ({
            id: n.slug,
            title: n.title,
            image: n.cardImage || n.heroImage || "/images/Nobilita Newsletter/Links/Macchia Vecchia Max App.jpg",
            date: (n.publishedAt || n.createdAt || "").slice(0, 10),
            href: `/newsletter/${n.slug}`,
          }));

        const merged = [...dbPosts];
        for (const hc of hardcodedPosts) {
          if (!merged.some((m) => m.id === hc.id)) {
            merged.push(hc);
          }
        }
        setNewsletterPosts(merged);
      })
      .catch(() => {
        if (active) setNewsletterPosts(hardcodedPosts);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          src="/images/newsletter page images/fior-di-melo-newsletter-hero.webp"
          alt="Newsletter Background"
          className="w-full h-full object-cover object-center block"
        />

        {/* Title overlay - aligned to exact container bounds */}
        <div className="absolute inset-0 flex items-center z-20 pointer-events-none">
          <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="font-ivymode font-light text-white uppercase tracking-[0.10em] text-[clamp(36px,6.5vw,80px)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            >
              NEWSLETTER
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Main Newsletter Grid Section */}
      <main className="w-full flex-1 bg-white py-12 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
            {newsletterPosts.map((post) => (
              <motion.div key={post.id} variants={cardVariants}>
                <Link href={post.href}>
                  <div className="relative w-full aspect-[16/10] overflow-hidden group cursor-pointer shadow-md">
                    {/* Newsletter Image */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover object-center transform scale-[1.08] group-hover:scale-100 transition-transform duration-700 ease-out"
                    />
                    {/* Centered Newsletter Title */}
                    <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8 text-center z-10 pointer-events-none">
                      <h2 className="font-ivymode font-light text-white text-[clamp(22px,2.6vw,44px)] tracking-[0.08em] group-hover:tracking-[0.22em] transition-all duration-500 ease-out leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] uppercase">
                        {post.title}
                      </h2>
                    </div>

                    {/* Bottom Right Date */}
                    <div className="absolute bottom-2 right-3 md:bottom-2 md:right-3 z-10 pointer-events-none select-none text-right">
                      <span className="font-ivymode font-light text-[#599eb8] md:text-[#5293ac] text-[clamp(11px,1.1vw,15px)] lg:text-[clamp(13px,1.2vw,18px)] tracking-[0.20em] drop-shadow-md">
                        {post.date}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Applications Teal Bar Section with PNG Icons */}
      <section className="w-full bg-[#006F8E] text-white py-10 md:py-12 border-t border-b border-white/10">
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

      {/* Statuario Ultimo 1 Background Footer Strip (NOBILITA.COM + DOWNLOAD CATALOG) */}
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

      <NewsletterPromoSection />

      <Footer />
    </div>
  );
}
