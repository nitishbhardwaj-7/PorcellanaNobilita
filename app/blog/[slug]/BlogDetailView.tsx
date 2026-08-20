"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Full literal class strings (required for Tailwind's scanner to pick them up —
// it can't see dynamically-concatenated partial class names).
const TITLE_SIZE_CLASSES: Record<string, string> = {
  small: "text-[24px] sm:text-[30px] md:text-[34px]",
  standard: "text-[32px] sm:text-[40px] md:text-[46px]",
  large: "text-[38px] sm:text-[48px] md:text-[56px]",
  xlarge: "text-[44px] sm:text-[56px] md:text-[66px]",
};

interface ContentBlock {
  type: "paragraph" | "heading" | "point" | "image";
  text?: string;
  title?: string;
  src?: string;
  alt?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  titleColor?: "black" | "teal";
  titleFont?: "ivymode" | "michroma";
  titleFontSize?: "small" | "standard" | "large" | "xlarge";
  author: string;
  authorImage: string;
  date: string;
  readTime: string;
  heroImage: string;
  heroImageAlt: string;
  content: ContentBlock[];
  tag?: string;
  tags?: string[];
  excerpt?: string;
}

export default function BlogDetailView({
  post,
  otherPosts,
}: {
  post: BlogPost;
  otherPosts: BlogPost[];
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % otherPosts.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + otherPosts.length) % otherPosts.length);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between overflow-x-hidden relative">
      <Navbar />

      {/* Back Button Arrow */}
      <Link
        href="/blog"
        className="group flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-neutral-300 hover:border-neutral-900 bg-neutral-50 hover:bg-neutral-100 transition-all duration-300 focus:outline-none absolute top-24 left-6 sm:top-[110px] sm:left-6 md:left-12 z-50"
        aria-label="Back to blog"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700 group-hover:text-neutral-900 transition-transform duration-300 transform group-hover:-translate-x-0.5"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </Link>

      {/* Main Column */}
      <main className="w-full max-w-[720px] mx-auto px-6 pt-20 sm:pt-12 pb-12 mt-[64px] md:mt-[80px]">
        {/* Title */}
        <div className="relative mb-8">
          <h1
            className={`${post.titleFont === "michroma" ? "font-michroma" : "font-ivymode"} ${
              post.titleColor === "teal" ? "text-[#007190]" : "text-neutral-900"
            } ${TITLE_SIZE_CLASSES[post.titleFontSize || "standard"]} font-normal leading-[1.12] tracking-[0.05em] uppercase text-center`}
          >
            {post.title}
          </h1>
        </div>

        {/* Hero image */}
        {post.heroImage && (
          <motion.div
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="mb-10 w-full"
          >
            <div className="w-full overflow-hidden rounded-sm shadow-sm">
              <img
                src={post.heroImage}
                alt={post.heroImageAlt}
                className="w-full h-auto object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
          </motion.div>
        )}

        {/* Blog Post Body Content with high-end editorial styling */}
        <article className="font-ivymode font-light text-[#545759] text-[clamp(14px,1.35vw,20px)] tracking-widest leading-[1.75] space-y-6 md:space-y-8">
          {post.content.map((block, idx) => {
            switch (block.type) {
              case "paragraph":
                return (
                  <p key={idx} className="font-light text-left">
                    {block.text}
                  </p>
                );
              case "heading": {
                const headingLines = block.text ? block.text.split("\n") : [];
                return (
                  <h2
                    key={idx}
                    className="font-ivymode font-medium text-[22px] sm:text-[26px] md:text-[28px] tracking-[0.05em] uppercase leading-tight pt-6 pb-2"
                  >
                    {headingLines.map((lineText, lineIdx) => (
                      <span
                        key={lineIdx}
                        className={
                          lineIdx === 0
                            ? "text-[#007190] block"
                            : "text-black block mt-1"
                        }
                      >
                        {lineText}
                      </span>
                    ))}
                  </h2>
                );
              }
              case "point":
                return (
                  <p key={idx} className="font-light text-left">
                    <strong className="font-ivymode font-medium text-[#007190] text-[clamp(14px,1.35vw,20px)] mr-2 tracking-widest">
                      {block.title}:
                    </strong>
                    {block.text}
                  </p>
                );
              case "image":
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 1.06 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="py-6 w-full"
                  >
                    <div className="w-full overflow-hidden rounded-sm shadow-sm">
                      <img
                        src={block.src}
                        alt={block.alt}
                        className="w-full h-auto object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                      />
                    </div>
                  </motion.div>
                );
              default:
                return null;
            }
          })}
        </article>
      </main>

      {/* Recent Blogs (What's New) Section */}
      {otherPosts.length > 0 && (
        <section className="w-full bg-white border-t border-neutral-100 pt-12 pb-12 px-6 md:px-12">
          <div className="w-full max-w-[1200px] mx-auto relative">
            <h2 className="font-ivymode text-center text-neutral-900 text-[28px] sm:text-[36px] md:text-[40px] leading-[1.2] tracking-[0.08em] uppercase mb-12">
              Recent Blogs
            </h2>

            {/* Carousel Row Container */}
            <div className="relative w-full flex items-center justify-center">
              {/* Left Arrow Button */}
              {otherPosts.length > 1 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-[-20px] sm:left-[-30px] md:left-[-50px] z-20 group flex items-center justify-center w-10 h-10 rounded-full bg-neutral-600 hover:bg-neutral-800 text-white transition-all duration-300 focus:outline-none shadow-md"
                  aria-label="Previous slide"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-300"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              )}

              {/* Card Container */}
              <div className="w-full bg-[#f9f9f9] border border-neutral-100 rounded-sm p-6 sm:p-8 md:p-12 min-h-[360px] flex items-center relative overflow-hidden">
                <div className="w-full">
                  {/* Slide Content with fade/slide animation */}
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full"
                  >
                    {/* Left Column: Image */}
                    <div className="w-full md:w-[48%] aspect-[16/10] overflow-hidden rounded-sm shadow-sm relative bg-neutral-100">
                      <img
                        src={otherPosts[activeIndex].heroImage}
                        alt={otherPosts[activeIndex].heroImageAlt}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                      />
                    </div>

                    {/* Right Column: Info */}
                    <div className="w-full md:w-[52%] flex flex-col items-start justify-center text-left">
                      <div className="flex items-center gap-4 mb-4 select-none">
                        <span className="font-ivymode text-[11px] text-neutral-500 tracking-wider">
                          {formatDate(otherPosts[activeIndex].date)}
                        </span>
                      </div>

                      <h3 className="font-ivymode font-medium text-neutral-900 text-[20px] sm:text-[24px] md:text-[26px] leading-[1.25] tracking-[0.03em] mb-4 uppercase">
                        {otherPosts[activeIndex].title}
                      </h3>

                      <p className="font-ivymode font-light text-[14px] sm:text-[15px] text-neutral-600 leading-[1.6] mb-6 text-left line-clamp-3">
                        {otherPosts[activeIndex].excerpt || (
                          otherPosts[activeIndex].content.find((c) => c.type === "paragraph")?.text || ""
                        )}
                      </p>

                      <Link
                        href={`/blog/${otherPosts[activeIndex].slug}`}
                        className="relative overflow-hidden group border border-neutral-900 bg-white px-6 py-2.5 font-ivymode text-[10px] sm:text-[11px] tracking-[0.15em] uppercase transition-colors duration-500 font-medium select-none inline-flex items-center justify-center"
                      >
                        <span className="absolute -inset-[1px] bg-neutral-900 scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
                        <span className="relative z-10 text-neutral-900 transition-colors duration-500 group-hover:text-white">
                          Read More
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Arrow Button */}
              {otherPosts.length > 1 && (
                <button
                  onClick={nextSlide}
                  className="absolute right-[-20px] sm:right-[-30px] md:right-[-50px] z-20 group flex items-center justify-center w-10 h-10 rounded-full bg-neutral-600 hover:bg-neutral-800 text-white transition-all duration-300 focus:outline-none shadow-md"
                  aria-label="Next slide"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              )}
            </div>

            {/* Slide Indicators */}
            {otherPosts.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {otherPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-[2px] transition-all duration-300 focus:outline-none ${index === activeIndex
                        ? "w-8 bg-neutral-800"
                        : "w-6 bg-neutral-200 hover:bg-neutral-400"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
