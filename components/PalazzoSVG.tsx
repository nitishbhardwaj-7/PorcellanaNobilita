"use client";

import React from "react";
import { motion } from "framer-motion";

interface PalazzoSVGProps {
  variant?: "white" | "sepia";
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function PalazzoSVG({ variant = "white", size = 300, className = "", animate = false }: PalazzoSVGProps) {
  const strokeColor = variant === "white" ? "#ffffff" : "#8b7355";
  
  // Staggered sequence variants for fine architectural details
  const getVariants = (delay: number) => ({
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.0, 
        delay: delay,
        ease: "easeInOut" 
      } 
    }
  });

  return (
    <svg 
      width={size} 
      height={size * 1.43456} 
      viewBox="0 0 240 344.3" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g stroke={strokeColor} strokeWidth="1.2" transform="translate(-30, -28.596) scale(1, 1.14385)">
        {/* Base Steps (Delay 0.1s - 0.3s) */}
        <motion.path 
          d="M30 320 L270 320" 
          strokeWidth="2" 
          variants={animate ? getVariants(0.1) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M125 323 L175 323" 
          strokeWidth="1.5" 
          variants={animate ? getVariants(0.2) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M120 326 L180 326" 
          strokeWidth="1" 
          variants={animate ? getVariants(0.3) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />

        {/* Facade Outer Edges (Delay 0.2s) */}
        <motion.path 
          d="M40 90 L40 320" 
          strokeWidth="1.5" 
          variants={animate ? getVariants(0.2) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M260 90 L260 320" 
          strokeWidth="1.5" 
          variants={animate ? getVariants(0.25) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />

        {/* Horizontal Cornices and Floor Bands (Delay 0.3s - 0.5s) */}
        {/* Roof Cornice */}
        <motion.path 
          d="M35 90 L265 90" 
          strokeWidth="2" 
          variants={animate ? getVariants(0.3) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M35 87 L265 87" 
          strokeWidth="0.8" 
          variants={animate ? getVariants(0.35) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        {/* Second Floor Cornice */}
        <motion.path 
          d="M38 165 L262 165" 
          strokeWidth="1.5" 
          variants={animate ? getVariants(0.4) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M38 162 L262 162" 
          strokeWidth="0.5" 
          variants={animate ? getVariants(0.45) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        {/* Ground Floor Cornice */}
        <motion.path 
          d="M38 245 L262 245" 
          strokeWidth="1.5" 
          variants={animate ? getVariants(0.5) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M38 242 L262 242" 
          strokeWidth="0.5" 
          variants={animate ? getVariants(0.55) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />

        {/* Trapezoidal Roof Outline & Center Pediment (Delay 0.4s - 0.6s) */}
        <motion.path 
          d="M40 87 L65 45 L235 45 L260 87" 
          strokeWidth="1.5" 
          variants={animate ? getVariants(0.4) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M65 45 L235 45" 
          strokeWidth="1" 
          variants={animate ? getVariants(0.5) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M125 45 L150 25 L175 45 Z" 
          strokeWidth="1" 
          variants={animate ? getVariants(0.6) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />

        {/* WINDOWS AND DOORS - TOP FLOOR (Delay 0.6s - 0.9s) */}
        {/* Rectangular Windows 1, 2, 4, 5 with Pediment Crowns */}
        <motion.rect x="52" y="105" width="18" height="30" variants={animate ? getVariants(0.6) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M49 105 L73 105 M52 135 L70 135" variants={animate ? getVariants(0.65) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M48 105 L61 97 L74 105" variants={animate ? getVariants(0.7) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        <motion.rect x="92" y="105" width="18" height="30" variants={animate ? getVariants(0.65) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M89 105 L113 105 M92 135 L110 135" variants={animate ? getVariants(0.7) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M88 105 L101 97 L114 105" variants={animate ? getVariants(0.75) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        <motion.rect x="190" y="105" width="18" height="30" variants={animate ? getVariants(0.7) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M187 105 L211 105 M190 135 L208 135" variants={animate ? getVariants(0.75) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M186 105 L199 97 L212 105" variants={animate ? getVariants(0.8) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        <motion.rect x="230" y="105" width="18" height="30" variants={animate ? getVariants(0.75) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M227 105 L251 105 M230 135 L248 135" variants={animate ? getVariants(0.8) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M226 105 L239 97 L252 105" variants={animate ? getVariants(0.85) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        {/* Center Arched Window with Balcony */}
        <motion.path 
          d="M136 135 L136 105 A 14 14 0 0 1 164 105 L164 135 Z" 
          variants={animate ? getVariants(0.8) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.rect x="130" y="132" width="40" height="8" variants={animate ? getVariants(0.85) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path 
          d="M130 132 L130 140 M135 132 L135 140 M140 132 L140 140 M145 132 L145 140 M150 132 L150 140 M155 132 L155 140 M160 132 L160 140 M165 132 L165 140 M170 132 L170 140" 
          strokeWidth="0.5" 
          variants={animate ? getVariants(0.9) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />

        {/* WINDOWS AND DOORS - MIDDLE FLOOR (Delay 0.8s - 1.1s) */}
        <motion.rect x="52" y="180" width="18" height="30" variants={animate ? getVariants(0.8) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M49 180 L73 180 M52 210 L70 210" variants={animate ? getVariants(0.85) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M48 180 L61 172 L74 180" variants={animate ? getVariants(0.9) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        <motion.rect x="92" y="180" width="18" height="30" variants={animate ? getVariants(0.85) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M89 180 L113 180 M92 210 L110 210" variants={animate ? getVariants(0.9) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M88 180 L101 172 L114 180" variants={animate ? getVariants(0.95) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        <motion.rect x="190" y="180" width="18" height="30" variants={animate ? getVariants(0.9) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M187 180 L211 180 M190 210 L208 210" variants={animate ? getVariants(0.95) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M186 180 L199 172 L212 180" variants={animate ? getVariants(1.0) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        <motion.rect x="230" y="180" width="18" height="30" variants={animate ? getVariants(0.95) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M227 180 L251 180 M230 210 L248 210" variants={animate ? getVariants(1.0) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M226 180 L239 172 L252 180" variants={animate ? getVariants(1.05) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        {/* Center Arched Window with Balcony */}
        <motion.path 
          d="M136 210 L136 180 A 14 14 0 0 1 164 180 L164 210 Z" 
          variants={animate ? getVariants(1.0) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.rect x="130" y="207" width="40" height="8" variants={animate ? getVariants(1.05) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path 
          d="M130 207 L130 215 M135 207 L135 215 M140 207 L140 215 M145 207 L145 215 M150 207 L150 215 M155 207 L155 215 M160 207 L160 215 M165 207 L165 215 M170 207 L170 215" 
          strokeWidth="0.5" 
          variants={animate ? getVariants(1.1) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />

        {/* WINDOWS AND PORTALS - GROUND FLOOR (Delay 1.0s - 1.4s) */}
        <motion.rect x="52" y="260" width="18" height="35" variants={animate ? getVariants(1.0) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M49 260 L73 260 M52 295 L70 295" variants={animate ? getVariants(1.05) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        <motion.rect x="92" y="260" width="18" height="35" variants={animate ? getVariants(1.05) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M89 260 L113 260 M92 295 L110 295" variants={animate ? getVariants(1.1) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        <motion.rect x="190" y="260" width="18" height="35" variants={animate ? getVariants(1.1) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M187 260 L211 260 M190 295 L208 295" variants={animate ? getVariants(1.15) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        <motion.rect x="230" y="260" width="18" height="35" variants={animate ? getVariants(1.15) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />
        <motion.path d="M227 260 L251 260 M230 295 L248 295" variants={animate ? getVariants(1.2) : {}} initial={animate ? "hidden" : "visible"} animate="visible" />

        {/* Center Arched Entrance Portal */}
        <motion.path 
          d="M135 320 L135 270 A 15 15 0 0 1 165 270 L165 320" 
          strokeWidth="2" 
          variants={animate ? getVariants(1.2) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M130 268 L170 268" 
          strokeWidth="2" 
          variants={animate ? getVariants(1.25) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M125 268 L150 252 L175 268 Z" 
          strokeWidth="1.5" 
          variants={animate ? getVariants(1.3) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
        <motion.path 
          d="M129 268 L129 320 M171 268 L171 320" 
          strokeWidth="1" 
          variants={animate ? getVariants(1.35) : {}} 
          initial={animate ? "hidden" : "visible"} 
          animate="visible" 
        />
      </g>
    </svg>
  );
}
