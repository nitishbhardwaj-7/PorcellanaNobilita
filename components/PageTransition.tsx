"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

/**
 * Premium page transition — a full-bleed dark panel wipes across the screen
 * as the outgoing page exits, holds briefly, then retreats to reveal the
 * incoming page. Like a velvet curtain drawing and releasing.
 *
 * Sequence:
 *   OUT  → panel wipes in  from left  (0.55s, power2.inOut)
 *   HOLD → brief pause while route changes
 *   IN   → panel wipes out to right   (0.65s, power2.inOut)
 */

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname      = usePathname();
  const overlayRef    = useRef<HTMLDivElement>(null);
  const labelRef      = useRef<HTMLDivElement>(null);
  // Track the rendered children separately from route so we swap
  // only after the curtain is fully closed
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isAnimating, setIsAnimating]         = useState(false);
  const prevPathname  = useRef(pathname);

  useEffect(() => {
    // First render — just reveal
    if (prevPathname.current === pathname) {
      // Initial page load: wipe OUT from full cover
      gsap.set(overlayRef.current, { scaleX: 1, transformOrigin: "right center" });
      gsap.to(overlayRef.current, {
        scaleX: 0,
        duration: 0.7,
        ease: "power2.inOut",
        delay: 0.05,
      });
      return;
    }

    // Route changed — run the full curtain sequence
    if (isAnimating) return;
    setIsAnimating(true);

    const overlay = overlayRef.current;
    const label   = labelRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        prevPathname.current = pathname;
      },
    });

    // 1. Wipe IN — panel sweeps from left, covers screen
    tl.set(overlay, { scaleX: 0, transformOrigin: "left center" })
      .to(overlay, {
        scaleX: 1,
        duration: 0.55,
        ease: "power2.inOut",
      })
      // Fade in label during hold
      .to(label, { opacity: 1, duration: 0.2, ease: "power2.out" }, "-=0.05")

      // 2. HOLD — swap children while curtain is fully closed
      .add(() => setDisplayChildren(children))
      .to({}, { duration: 0.2 }) // brief hold

      // Fade label out
      .to(label, { opacity: 0, duration: 0.15, ease: "power2.in" })

      // 3. Wipe OUT — panel retreats to the right, reveals new page
      .set(overlay, { transformOrigin: "right center" })
      .to(overlay, {
        scaleX: 0,
        duration: 0.65,
        ease: "power2.inOut",
      });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Keep children in sync when not animating
  useEffect(() => {
    if (!isAnimating) {
      setDisplayChildren(children);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <>
      {/* Page content */}
      {displayChildren}

      {/* Full-screen curtain overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{
          backgroundColor: "#0a0a0a",
          transformOrigin: "left center",
          transform: "scaleX(0)",
        }}
      >
        {/* Subtle center label — NOBILITA wordmark during transition */}
        <div
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          <span className="font-michroma text-white/60 tracking-[0.4em] text-[11px] uppercase select-none">
            NOBILITA
          </span>
        </div>
      </div>
    </>
  );
}
