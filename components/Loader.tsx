"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NobilitaHouseSVG from "@/components/NobilitaHouseSVG";

interface LoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function Loader({ isLoading, onComplete }: LoaderProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] bg-[#007190] flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center justify-center">
            {/* Animated House SVG */}
            <div className="h-[319px] w-[223px] flex items-center justify-center">
              <NobilitaHouseSVG 
                variant="white" 
                size={223} 
                animate={true} 
                className="w-full h-full object-contain"
                onAnimationComplete={() => {
                  setTimeout(() => {
                    if (onComplete) {
                      onComplete();
                    }
                  }, 1000);
                }}
              />
            </div>
            
            {/* Programmatic Logo Group */}
            <div className={`mt-10 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
              <img 
                src="/images/NOBILITA_white.png" 
                alt="Porcellana Nobilita" 
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Sharp-edged Loading Bar */}
            <div className="mt-16 w-[185px] h-[10px] bg-white/20 overflow-hidden relative">
              {showContent && (
                <div className="absolute top-0 left-0 h-full bg-white loading-bar-fill" />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
