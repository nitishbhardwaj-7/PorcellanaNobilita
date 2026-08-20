"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NavigationOverlay from "./NavigationOverlay";

export default function Navbar({ forceVisible = false }: { forceVisible?: boolean }) {
  const pathname = usePathname();
  const isHomeScreen = pathname === "/";
  const isExplorePage = pathname === "/explore-collection";
  const isOurStoryPage = pathname === "/our-story";

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isInsideBrandIntro, setIsInsideBrandIntro] = useState(isHomeScreen || isExplorePage || isOurStoryPage);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseNearTop = useRef(false);

  const resetHideTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      // Hide only if we are scrolled down and mouse is not at the top
      if (window.scrollY > 50 && !isMouseNearTop.current) {
        setIsVisible(false);
      }
    }, 2500);
  };

  const showNavbar = () => {
    setIsVisible(true);
    resetHideTimeout();
  };

  // Scroll event listener to check if we are in the initial section of the page (BrandIntro on Home, Hero on Explore)
  useEffect(() => {
    if (!isHomeScreen && !isExplorePage && !isOurStoryPage) {
      setIsInsideBrandIntro(false);
      return;
    }

    let threshold = 380;
    const updateThreshold = () => {
      if (isHomeScreen || isOurStoryPage) {
        threshold = window.innerHeight * 0.9;
      } else if (isExplorePage) {
        const heroEl = document.getElementById("explore-hero");
        threshold = heroEl ? heroEl.offsetHeight : 380;
      }
    };

    updateThreshold();

    const checkScrollPosition = () => {
      const inside = window.scrollY < threshold;
      setIsInsideBrandIntro(inside);
      if (inside) {
        setIsVisible(false);
      }
    };

    const handleResize = () => {
      updateThreshold();
      checkScrollPosition();
    };

    checkScrollPosition();
    window.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", handleResize);

    // Run again slightly later to ensure DOM elements have layout completed
    const timer = setTimeout(updateThreshold, 150);

    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [isHomeScreen, isExplorePage, isOurStoryPage]);

  // Mutation observer to hide navbar instantly when body overflow is hidden (modal open)
  useEffect(() => {
    if (forceVisible) return;
    const checkBodyScroll = () => {
      if (document.body.style.overflow === "hidden") {
        setIsVisible(false);
      }
    };

    checkBodyScroll();

    const observer = new MutationObserver(checkBodyScroll);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, [forceVisible]);

  // Scroll event handling for normal nav visibility
  useEffect(() => {
    if (forceVisible) return;
    if (isInsideBrandIntro) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      if (document.body.style.overflow === "hidden") {
        setIsVisible(false);
        return;
      }
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 50) {
        showNavbar();
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        showNavbar();
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide immediately
        setIsVisible(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial trigger to hide after landing if no scroll/hover occurs
    resetHideTimeout();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [lastScrollY, isInsideBrandIntro, forceVisible]);

  // Mouse move event handling
  useEffect(() => {
    if (forceVisible) return;
    if (isInsideBrandIntro) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.body.style.overflow === "hidden") {
        setIsVisible(false);
        return;
      }
      // If mouse is within 80px of the top of the viewport
      if (e.clientY <= 80) {
        isMouseNearTop.current = true;
        setIsVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } else {
        if (isMouseNearTop.current) {
          isMouseNearTop.current = false;
          resetHideTimeout();
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isInsideBrandIntro, forceVisible]);

  return (
    <>
      {/* Scrollable / Hoverable Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[10000] flex items-center justify-between px-6 md:px-12 py-3 md:py-4 bg-[#007190] shadow-md transition-transform duration-500 ease-in-out transform ${
          forceVisible || ((isVisible || isNavOpen) && !isInsideBrandIntro) ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Hamburger Icon — hidden instantly (no fade) once the menu opens,
            since the overlay has its own back-arrow close button. Previously
            this stayed rendered underneath the overlay's 0.4s fade-in, which
            made it look like the hamburger itself was fading out slowly.
            Uses `invisible` (not a conditional unmount) so it keeps its
            layout space in this flex row — removing it entirely would
            shift the logo since this row only has these two children. */}
        <button
          onClick={() => setIsNavOpen(true)}
          className={`relative w-10 h-10 focus:outline-none z-[10000] transition-opacity hover:opacity-80 flex items-center justify-center ${
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

        {/* Logo */}
        <Link href="/" className="cursor-pointer transition-opacity">
          <img
            src="/images/NOBILITA_white.png"
            alt="Porcellana Nobilita"
            loading="lazy"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>
      </nav>

      {/* Navigation Overlay */}
      <NavigationOverlay isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </>
  );
}
