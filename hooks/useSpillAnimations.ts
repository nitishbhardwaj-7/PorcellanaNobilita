"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useSpillAnimations() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".spill-sec");

      sections.forEach((sec) => {
        const illust = sec.querySelector<HTMLElement>(".spill-illust");
        const heading = sec.querySelector<HTMLElement>("h3");
        const steps = sec.querySelectorAll<HTMLElement>(".spill-text > div");
        const text = sec.querySelector<HTMLElement>(".spill-text");
        const subnote = sec.querySelector<HTMLElement>(".wine-subnote");

        // Detect spill type
        const isOil = !!sec.querySelector("#OilSpillSVG");
        const isCoffee = !!sec.querySelector("#CoffeeSpillSVG");
        const isWine = !!sec.querySelector("#WineSpillSVG");

        // Initial setup for the entire section container
        gsap.set(sec, { opacity: 0, y: 30 });
        if (heading) gsap.set(heading, { opacity: 0, y: 15 });
        if (text) gsap.set(text, { opacity: 0, y: 15 });
        if (steps.length) gsap.set(steps, { opacity: 0, y: 10 });
        if (subnote) gsap.set(subnote, { opacity: 0, y: 15 });

        // Initialize SVG elements for stroke drawing
        const paths = sec.querySelectorAll<SVGPathElement>("path:not(.no-anim)");
        paths.forEach((path) => {
          let length = 0;
          try {
            length = path.getTotalLength();
          } catch (e) {
            length = 250;
          }
          if (!length) length = 250;

          // Exclude steam-lines or custom lines from full white fill initially
          const isSteam = path.classList.contains("coffee-steam-line");
          const isShimmer = path.classList.contains("wine-shimmer-line");

          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            stroke: "#ffffff",
            strokeWidth: 1.0,
            fillOpacity: isSteam || isShimmer ? 0 : 0,
            opacity: isSteam || isShimmer ? 0 : 1,
          });
        });

        // Main section timeline triggered when entering viewport
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: sec,
            start: "top 80%",
            once: true,
          },
        });

        // 1. Section fade & shift up
        mainTl.to(sec, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" });

        // 2. Heading reveal (Title first)
        if (heading) {
          mainTl.to(heading, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.6");
        }

        // Helper to animate drawing of paths
        const animatePathDraw = (selector: string, duration: number, stagger: number = 0.05) => {
          const targets = sec.querySelectorAll<SVGPathElement>(selector);
          if (!targets.length) return gsap.timeline();

          const tl = gsap.timeline();
          targets.forEach((path, i) => {
            tl.to(path, {
              strokeDashoffset: 0,
              duration: duration,
              ease: "power2.out",
            }, i * stagger);
          });
          return tl;
        };

        // Set timeline label for start of SVG animations to measure 50% completion
        mainTl.addLabel("svgStart");
        const textOffset = isOil ? "+=0.4" : isCoffee ? "+=0.35" : "+=0.3";

        // 3. SVG Drawing animations sequence (Faster)
        if (isOil) {
          // Initial bottle angle before settling
          gsap.set(illust, { rotation: 2, transformOrigin: "center bottom" });

          // Sequence: Bottle outline -> Oil stream -> Puddle spill
          mainTl.add(animatePathDraw(".oil-bottle", 0.25, 0.015), "-=0.1");
          mainTl.add(animatePathDraw(".oil-stream", 0.2, 0.01), "-=0.1");
          mainTl.add(animatePathDraw(".oil-spill", 0.3, 0.02), "-=0.1");
          mainTl.add(animatePathDraw(".oil-spill-ripple", 0.15, 0.015), "-=0.1");

          // Settle bottle rotation
          mainTl.to(illust, { rotation: 0, duration: 0.5, ease: "power3.out" }, "-=0.3");

          // Loop slowly the liquid ripple across spill (6-8s)
          const ripples = sec.querySelectorAll(".oil-spill-ripple");
          if (ripples.length) {
            gsap.to(ripples, {
              y: "+=1.5",
              x: "+=1",
              scale: 1.01,
              duration: 7,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              stagger: 0.3,
            });
          }
        }

        if (isCoffee) {
          // Initial mug angle before settling
          gsap.set(illust, { rotation: -1.5, transformOrigin: "center bottom" });

          const coffeeShape = sec.querySelector(".coffee-shape");
          const clipRect = sec.querySelector(".coffee-clip-rect");

          if (clipRect) {
            // Start the clip rect low and with zero height
            gsap.set(clipRect, { attr: { y: 170, height: 0 } });
            
            // Wipe from bottom to top
            mainTl.to(clipRect, {
              attr: { y: 65.93, height: 103.59 },
              duration: 1.2,
              ease: "power2.inOut"
            }, "-=0.1");
          }
          
          if (coffeeShape) {
            // Fade in and slight scale up to make it feel dynamic
            mainTl.fromTo(coffeeShape, 
              { opacity: 0, scale: 0.95, transformOrigin: "center center" },
              { opacity: 0.8, scale: 1, duration: 1.2, ease: "power2.out" },
              "<" // Play at the same time as the wipe
            );
          }
          // Settle mug rotation
          mainTl.to(illust, { rotation: 0, duration: 0.5, ease: "power3.out" }, "-=0.3");
        }

        if (isWine) {
          // Initial wine glass angle before settling
          gsap.set(illust, { rotation: 4.5, transformOrigin: "center bottom" });

          // Sequence: Glass outline -> Wine puddle afterward
          mainTl.add(animatePathDraw(".wine-glass", 0.3, 0.015), "-=0.1");
          mainTl.add(animatePathDraw(".wine-spill", 0.25, 0.02), "-=0.1");

          // Settle glass rotation into final resting position (0deg)
          mainTl.to(illust, { rotation: 0, duration: 0.5, ease: "power3.out" }, "-=0.3");

          // Shimmer reflection loop on glass
          const wineShimmer = sec.querySelector(".wine-shimmer-line");
          if (wineShimmer) {
            mainTl.to(wineShimmer, {
              strokeDashoffset: 0,
              opacity: 0.4,
              duration: 0.3,
              ease: "power2.out",
            }, "-=0.2");

            // Loop shimmer shine
            gsap.to(wineShimmer, {
              opacity: 0.15,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }

          // Slow idle ripple on puddle / wave
          const wineSpill = sec.querySelectorAll(".wine-spill");
          if (wineSpill.length) {
            gsap.to(wineSpill, {
              scaleY: 1.015,
              scaleX: 1.008,
              duration: 6,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              transformOrigin: "center center",
            });
          }
        }

        // 4. Content Text reveal (Points) - Begins at 50% completion of the SVG animations
        if (text) {
          mainTl.to(text, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, `svgStart${textOffset}`);
        }

        // 5. Steps reveal with stagger
        if (steps.length) {
          mainTl.to(steps, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }, "-=0.2");
        }

        // 6. Subnote reveal
        if (subnote) {
          mainTl.to(subnote, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.1");
        }
      });

      // Desktop Hover Interaction
      if (!window.matchMedia("(hover: none)").matches) {
        gsap.utils.toArray<HTMLElement>(".spill-illust").forEach((w) => {
          w.style.willChange = "transform";

          w.addEventListener("mouseenter", () => {
            gsap.to(w, {
              scale: 1.03,
              y: -2,
              duration: 0.5,
              ease: "power3.out",
            });
          });

          w.addEventListener("mouseleave", () => {
            gsap.to(w, {
              scale: 1,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              duration: 0.5,
              ease: "power3.out",
            });
          });

          w.addEventListener("mousemove", (e: MouseEvent) => {
            const rect = w.getBoundingClientRect();
            const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
            const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

            // Max tilt 3 degrees
            gsap.to(w, {
              rotateY: normalizedX * 3,
              rotateX: -normalizedY * 3,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);
}
