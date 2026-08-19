"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import NavigationOverlay from "./NavigationOverlay";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  image?: string;
  isLoaderActive?: boolean;
}

export default function BrandIntro({ title, subtitle, buttonText, image, isLoaderActive = false }: Props) {
  const defaultSubtitle = "Inspired by Italy's noble heritage and Baroque architecture, NOBILITA porcelain is crafted in Modena, Italy, home to Ferrari, Acetaia Giusti, and Brioni. A collection where timeless Italian elegance meets advanced porcelain technology.";
  const sectionRef = useRef<HTMLElement>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const paragraphText = subtitle || defaultSubtitle;
  const words = paragraphText.split(" ");

  useEffect(() => {
    if (isLoaderActive) return;

    const section = sectionRef.current;
    if (!section) return;

    let cleanupBtn: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: isLoaderActive ? 0.8 : 0.1, // Delay slightly only if loader animation is active
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        }
      });

      tl.to(".brand-menu-btn-wrapper", {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      })
        .to(".brand-tag-wrapper", {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out"
        }, "-=0.6")
        .to(".brand-tag-subtext", {
          opacity: 1,
          duration: 1.0,
          ease: "power2.out"
        }, "-=0.6")
        .to(".brand-logo", {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out"
        }, "-=0.8")
        .to(".brand-desc-word", {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.02,
          ease: "power3.out"
        }, "-=0.8")
        .to(".brand-btn-wrapper", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        .to(".brand-social-wrapper", {
          opacity: 1,
          duration: 1.0,
          ease: "power2.out"
        }, "-=0.6");

      const btn = section.querySelector<HTMLElement>(".brand-story-btn");
      if (btn) {
        const onMouseDown = () => { gsap.to(btn, { scale: 0.96, duration: 0.15, ease: "power2.out" }); };
        const onMouseUp = () => { gsap.to(btn, { scale: 1.0, duration: 0.25, ease: "power2.out" }); };
        const onMouseLeave = () => { gsap.to(btn, { scale: 1.0, duration: 0.25, ease: "power2.out" }); };

        btn.addEventListener("mousedown", onMouseDown);
        btn.addEventListener("mouseup", onMouseUp);
        btn.addEventListener("mouseleave", onMouseLeave);

        cleanupBtn = () => {
          btn.removeEventListener("mousedown", onMouseDown);
          btn.removeEventListener("mouseup", onMouseUp);
          btn.removeEventListener("mouseleave", onMouseLeave);
        };
      }
    });

    return () => {
      ctx.revert();
      if (cleanupBtn) cleanupBtn();
    };
  }, [paragraphText, isLoaderActive]);

  return (
    <section
      ref={sectionRef}
      className="brand-intro-section relative w-full min-h-screen bg-[#007190] flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 py-16 md:py-20 lg:py-24"
    >
      {/* Menu Icon on Top Left */}
      <div className="brand-menu-btn-wrapper absolute top-6 left-6 md:top-8 md:left-12 lg:top-10 lg:left-14 z-[10000] opacity-0">
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="relative w-10 h-10 lg:w-11 lg:h-11 focus:outline-none transition-opacity hover:opacity-80 flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          <span
            className="absolute block h-[2px] w-12 lg:w-13 bg-white transition-all duration-300 ease-in-out"
            style={{
              transform: "translateY(-6px) rotate(0deg)"
            }}
          />
          <span
            className="absolute block h-[2px] w-12 lg:w-13 bg-white transition-all duration-300 ease-in-out"
            style={{
              transform: "scaleX(1)",
              opacity: 1
            }}
          />
          <span
            className="absolute block h-[2px] w-12 lg:w-13 bg-white transition-all duration-300 ease-in-out"
            style={{
              transform: "translateY(6px) rotate(0deg)"
            }}
          />
        </button>
      </div>

      {/* Social Media Links Sidebar / Mobile Bottom Strip */}
      <div className="brand-social-wrapper absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-12 lg:left-14 md:bottom-12 z-30 flex flex-row md:flex-col items-center justify-center gap-6 sm:gap-7 md:gap-5 opacity-0">
        {/* Top Vertical Divider Line (Desktop only) */}
        <div className="hidden md:block w-[1px] h-14 md:h-20 bg-white/20 mb-1" />

        {/* WhatsApp */}
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 hover:text-white transition-all duration-300 transform hover:scale-110 shrink-0"
          aria-label="WhatsApp"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 hover:text-white transition-all duration-300 transform hover:scale-110 shrink-0"
          aria-label="Instagram"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>

        {/* Facebook */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 hover:text-white transition-all duration-300 transform hover:scale-110 shrink-0"
          aria-label="Facebook"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 hover:text-white transition-all duration-300 transform hover:scale-110 shrink-0"
          aria-label="LinkedIn"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
          </svg>
        </a>
      </div>

      {/* Navigation Overlay */}
      <NavigationOverlay isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl flex flex-col items-center text-center space-y-9 md:space-y-12 lg:space-y-14">

        {/* Top Header Image (tag.png) */}
        <div className="brand-tag-wrapper w-full max-w-[450px] md:max-w-[750px] lg:max-w-[920px] xl:max-w-[1050px] flex flex-col items-center opacity-0 translate-y-8">
          <img
            src="/images/Links/tag.png"
            alt="Il Gres Imperiale d'Italia"
            loading="lazy"
            className="w-full h-auto object-contain"
          />
          <span className="brand-tag-subtext font-michroma text-white/50 text-[clamp(12px,1.5vw,20px)] lg:text-[clamp(15px,1.5vw,24px)] tracking-[0.2em] block opacity-0 mt-1 md:mt-2">
            The Imperial Stone of Italy
          </span>
        </div>

        {/* Middle Logo (NOBILITA_white.png) */}
        <div className="brand-logo-wrapper w-full max-w-[280px] md:max-w-[450px] lg:max-w-[560px] xl:max-w-[640px] overflow-hidden py-1">
          <img
            src={image || "/images/NOBILITA_white.png"}
            alt="Porcellana Nobilita"
            loading="lazy"
            className="brand-logo w-full h-auto object-contain translate-y-full opacity-0"
          />
        </div>

        {/* Bottom Paragraph Description */}
        <div className="w-full max-w-[800px] lg:max-w-[980px] xl:max-w-[1120px]">
          <p className="font-ivymode font-extralight text-white text-justify [text-align-last:center] text-[clamp(15px,1.4vw,18px)] lg:text-[clamp(17px,1.5vw,21px)] xl:text-[clamp(18px,1.5vw,23px)] tracking-widest leading-[30px] lg:leading-[38px] xl:leading-[42px] w-full mt-2">
            {words.map((word, idx) => (
              <React.Fragment key={idx}>
                <span className="inline-block overflow-hidden align-bottom">
                  <span className="brand-desc-word inline-block translate-y-full opacity-0">
                    {word}
                  </span>
                </span>
                {" "}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Button: OUR STORY */}
        <div className="brand-btn-wrapper opacity-0 translate-y-6">
          <Link href="/our-story">
            <button
              className="brand-story-btn relative overflow-hidden border border-white text-white bg-transparent px-8 py-2.5 lg:px-10 lg:py-3.5 font-michroma text-[clamp(12px,1.3vw,18px)] lg:text-[clamp(14px,1.4vw,20px)] tracking-[0.25em] transition-colors duration-500 uppercase group"
            >
              <span className="absolute -inset-[1px] bg-white scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-[#007190]">
                {buttonText || "OUR STORY"}
              </span>
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
