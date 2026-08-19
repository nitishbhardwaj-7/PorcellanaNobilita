"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isOnTeal, setIsOnTeal] = useState(false);

  const checkBgColor = useCallback(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Fixed position coordinate of scroll indicator (bottom-12 right-6 md:right-10)
    const rightOffset = window.innerWidth >= 768 ? 40 : 24;
    const x = window.innerWidth - rightOffset;
    const y = window.innerHeight - 48;

    if (x < 0 || y < 0) return;

    const elements = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [];

    let isTealBg = false;

    for (const el of elements) {
      // Ignore scroll indicator element itself
      if (el.closest(".scroll-indicator-container")) continue;

      // 1. Check class names up the DOM tree
      let curr: Element | null = el;
      let foundTealInClass = false;
      while (curr) {
        if (typeof curr.className === "string" && curr.className.includes("bg-[#007190]")) {
          foundTealInClass = true;
          break;
        }
        curr = curr.parentElement;
      }

      if (foundTealInClass) {
        isTealBg = true;
        break;
      }

      // 2. Check computed background color
      const comp = window.getComputedStyle(el);
      const bg = comp.backgroundColor;

      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const r = parseInt(match[1], 10);
          const g = parseInt(match[2], 10);
          const b = parseInt(match[3], 10);

          // RGB check for #007190 (rgb(0, 113, 144))
          if (Math.abs(r - 0) <= 20 && Math.abs(g - 113) <= 20 && Math.abs(b - 144) <= 20) {
            isTealBg = true;
            break;
          }

          // If element has a solid non-transparent background that isn't teal, stop checking elements beneath
          break;
        }
      }
    }

    setIsOnTeal(isTealBg);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show indicator only after scrolling down 150px
      setIsVisible(scrollY > 150);

      // Check if user is near the bottom (within 80px of page bottom)
      setIsAtBottom(scrollY + windowHeight >= documentHeight - 80);

      // Check background color under indicator
      checkBgColor();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Trigger on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [checkBgColor]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const arrowVariants = {
    down: { rotate: 0 },
    up: { rotate: 180 },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={scrollToTop}
          className="scroll-indicator-container fixed bottom-12 right-6 md:right-10 z-[999] cursor-pointer select-none group flex items-center justify-center p-2"
        >
          {/* Animated Chevron Container */}
          <motion.div
            variants={arrowVariants}
            animate={isAtBottom ? "up" : "down"}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className={`flex flex-col items-center -space-y-2.5 transition-colors duration-300 ${
              isOnTeal ? "text-white" : "text-[#007190]"
            }`}
          >
            {/* Chevron 1 (Top) */}
            <motion.div
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [0, 3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: "easeInOut",
                delay: 0,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.div>

            {/* Chevron 2 (Bottom) */}
            <motion.div
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [0, 3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: "easeInOut",
                delay: 0.35,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
