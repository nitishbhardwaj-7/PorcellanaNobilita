"use client";

import React, { useEffect, useRef } from "react";
import { NOBILITA_HOUSE_PATHS } from "./nobilitaHousePaths";

interface NobilitaHouseSVGProps {
  variant?: "white" | "sepia" | "dark";
  size?: number;
  className?: string;
  animate?: boolean;
  onAnimationComplete?: () => void;
}

const VB_X = 50;
const VB_Y = 11;
const VB_W = 183;
const VB_H = 262;
const ASPECT = VB_H / VB_W;

export default function NobilitaHouseSVG({
  size = 223,
  variant = "white",
  className = "",
  animate = false,
  onAnimationComplete,
}: NobilitaHouseSVGProps) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const onCompleteRef = useRef(onAnimationComplete);

  // Sync the ref with any updated callback reference without restarting the animation effect
  useEffect(() => {
    onCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  // Step 2: Animate each sub-path via direct DOM manipulation
  useEffect(() => {
    if (!animate) {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      return;
    }

    const els = pathRefs.current.filter(Boolean) as SVGPathElement[];
    if (els.length === 0) {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      return;
    }

    // Phase A: Hide all paths (dashoffset = full length)
    // Batch read path lengths first to avoid layout thrashing (464 sequential layout recalculations)
    const lengths = els.map((el) => el.getTotalLength());
    
    els.forEach((el, i) => {
      const len = lengths[i];
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      el.style.opacity = "1";
      el.style.transition = "none";
    });

    // Phase B: After paint, trigger staggered drawing from bottom to top
    const startTimer = setTimeout(() => {
      const minY = VB_Y; // 11
      const maxY = VB_Y + VB_H; // 273
      const range = maxY - minY; // 262

      els.forEach((el) => {
        const yAttr = el.getAttribute("data-y");
        const y = yAttr ? parseFloat(yAttr) : minY;

        // Map Y coordinate to delay: bottom Y coordinate has 0 delay, top Y coordinate has 3.5s delay
        const ratio = (maxY - y) / range;
        const delay = Math.max(0, Math.min(3.5, ratio * 3.5));

        el.style.transition = `stroke-dashoffset 1.5s ease-in-out ${delay.toFixed(3)}s`;
        el.style.strokeDashoffset = "0";
      });
    }, 60);

    // Call onAnimationComplete when the transition completes
    // Total animation time is 3.5s stagger + 1.5s transition = 5.0s + 60ms start delay = 5060ms
    const completeTimer = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 5060);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [animate]);

  const strokeColor = variant === "white" ? "#ffffff" : variant === "sepia" ? "#8b7355" : "#1a1a1a";
  const svgWidth = size;
  const svgHeight = Math.round(size * ASPECT);

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {NOBILITA_HOUSE_PATHS.map((d, i) => {
        const match = d.match(/^M\s*(-?\d+\.?\d*)\s*[\s,]\s*(-?\d+\.?\d*)/i);
        const y = match ? parseFloat(match[2]) : VB_Y;

        return (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
            stroke={strokeColor}
            strokeWidth="0.25"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-y={y}
            style={animate ? { opacity: 0 } : undefined}
          />
        );
      })}
    </svg>
  );
}
