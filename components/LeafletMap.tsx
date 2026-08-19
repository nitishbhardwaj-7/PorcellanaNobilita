"use client";

import React from "react";

interface LeafletMapProps {
  coordinates: [number, number];
  title: string;
  line1: string;
  line2: string;
  googleMapsUrl: string;
  mapEmbedUrl?: string;
}

export default function LeafletMap({ coordinates, title, line1, line2, googleMapsUrl }: LeafletMapProps) {
  const [lat, lng] = coordinates;
  
  // Construct a pin-less Google Maps embed URL using coordinates and language English
  const embedUrl = `https://maps.google.com/maps?ll=${lat},${lng}&z=16&output=embed&hl=en`;

  return (
    <div
      className="w-full h-full relative cursor-pointer select-none overflow-hidden"
      onClick={() => window.open(googleMapsUrl, "_blank", "noopener,noreferrer")}
    >
      {/* Grayscale Google Maps Iframe */}
      <iframe
        title={title}
        src={embedUrl}
        width="100%"
        height="100%"
        style={{
          border: 0,
          pointerEvents: "none", // Prevent interaction (dragging/panning) to make the whole map clickable
        }}
        allowFullScreen={false}
        loading="lazy"
        className="w-full h-full grayscale-map transition-all duration-700 ease-in-out"
      />

      {/* Custom marker positioned exactly at the center of the container */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="custom-marker-wrapper">
          <div className="custom-marker-glow"></div>
          <div className="custom-marker-dot"></div>
          <div className="custom-marker-badge">
            <div className="custom-marker-icon-circle">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <div className="custom-marker-label">
              <div className="line-1">{line1}</div>
              <div className="line-2">{line2}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
