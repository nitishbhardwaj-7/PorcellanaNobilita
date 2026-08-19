"use client";

import React from "react";
import NobilitaHouseSVG from "./NobilitaHouseSVG";

export default function AnimatedNeighborhood() {
  return (
    <div className="relative w-full max-w-[200px] md:max-w-[240px] flex items-center justify-center mx-auto overflow-visible">
      {/* The static house in the center */}
      <div className="relative z-10 w-full flex justify-center">
        <NobilitaHouseSVG variant="white" size={240} className="w-full h-auto" animate={true} />
      </div>
    </div>
  );
}
