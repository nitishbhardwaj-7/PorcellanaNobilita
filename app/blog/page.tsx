"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { HARDCODED_BLOGS } from "@/lib/hardcodedBlogs";

gsap.registerPlugin(ScrollTrigger);

interface BlogListItem {
  id: string;
  title: string;
  image: string;
  date: string;
  href: string;
}

export default function BlogPage() {
  const blogTileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const hcPosts: BlogListItem[] = HARDCODED_BLOGS.map((b) => ({
      id: b.slug,
      title: b.title,
      image: b.heroImage || "/images/blogs page images/ferro-industriale-blog-hero.webp",
      date: b.publishedAt.slice(0, 10),
      href: `/blog/${b.slug}`,
    }));

    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const dbPosts: BlogListItem[] = (data.data || [])
          .filter((b: any) => b.status === "PUBLISHED")
          .map((b: any) => ({
            id: b.slug,
            title: b.title,
            image: b.heroImage || "/images/blogs page images/ferro-industriale-blog-hero.webp",
            date: (b.publishedAt || b.createdAt || "").slice(0, 10),
            href: `/blog/${b.slug}`,
          }));

        const merged = [...dbPosts];
        for (const hc of hcPosts) {
          if (!merged.some((m) => m.id === hc.id)) {
            merged.push(hc);
          }
        }
        setBlogPosts(merged);
      })
      .catch(() => {
        if (active) {
          setBlogPosts(hcPosts);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const cleanupFns: (() => void)[] = [];

    const ctx = gsap.context(() => {
      blogTileRefs.current.forEach((tile) => {
        if (!tile) return;

        const img = tile.querySelector<HTMLElement>(".blog-card-img");
        const titleEl = tile.querySelector<HTMLElement>(".blog-card-title");

        if (!img || !titleEl) return;

        // 1. Initial Clip-Path Reveal & Scale on Scroll
        gsap.set(tile, { clipPath: "inset(0 0 100% 0)" });
        gsap.set(img, { scale: 1.2 });
        gsap.set(titleEl, { y: 15, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: tile,
            start: "top 85%",
            once: true,
          },
        });

        tl.to(tile, {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.2,
          ease: "power3.inOut",
        })
          .to(
            img,
            {
              scale: 1.08,
              duration: 1.4,
              ease: "power2.out",
            },
            "-=1.0"
          )
          .to(
            titleEl,
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.8"
          );

        // 2. Interactive Image Hover Effect (smooth scale without text expansion)
        const onMouseEnter = () => {
          gsap.to(img, {
            scale: 1.0,
            duration: 0.9,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const onMouseLeave = () => {
          gsap.to(img, {
            scale: 1.08,
            duration: 1.2,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        tile.addEventListener("mouseenter", onMouseEnter);
        tile.addEventListener("mouseleave", onMouseLeave);

        cleanupFns.push(() => {
          tile.removeEventListener("mouseenter", onMouseEnter);
          tile.removeEventListener("mouseleave", onMouseLeave);
        });
      });
    });

    return () => {
      ctx.revert();
      cleanupFns.forEach((fn) => fn());
    };
  }, [loading, blogPosts.length]);

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
          src="/images/blogs page images/ferro-industriale-blog-hero.webp"
          alt="Blog Background"
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
              BLOG
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Main Blogs Grid Section */}
      <main className="w-full flex-1 bg-white py-12 md:py-20">
        <div className="w-full max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24">
          {!loading && blogPosts.length === 0 ? (
            <div className="w-full py-24 text-center">
              <p className="font-ivymode text-neutral-400 text-lg tracking-wide">
                No blog posts published yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
              {blogPosts.map((post, idx) => (
                <Link key={post.id} href={post.href} className="block">
                  <div
                    ref={(el) => { blogTileRefs.current[idx] = el; }}
                    className="blog-tile group relative w-full aspect-[16/10] overflow-hidden cursor-pointer shadow-md"
                  >
                    {/* Blog Image */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="blog-card-img w-full h-full object-cover object-center transform"
                    />

                    {/* Centered Blog Title */}
                    <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8 text-center z-10 pointer-events-none">
                      <h2 className="blog-card-title font-ivymode font-light text-white text-[clamp(22px,2.6vw,44px)] tracking-wide leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] whitespace-pre-line uppercase">
                        {post.title}
                      </h2>
                    </div>

                    {/* Bottom Right Date */}
                    <div className="absolute bottom-2 right-3 md:bottom-3 md:right-4 z-10 pointer-events-none select-none text-right">
                      <span className="blog-card-date font-ivymode font-light text-[#007190] text-[clamp(11px,1.1vw,15px)] lg:text-[clamp(13px,1.2vw,18px)] tracking-[0.20em] drop-shadow-md block">
                        {post.date}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
