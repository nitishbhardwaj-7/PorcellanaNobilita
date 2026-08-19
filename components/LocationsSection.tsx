"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#fcfbfa] animate-pulse flex items-center justify-center text-xs text-[#8b8b8b]">
      Loading Map...
    </div>
  ),
});

interface LocationDetail {
  name: string;
  mapEmbedUrl: string;
  address: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
  coordinates: [number, number];
  line1: string;
  line2: string;
}

const locationsData: LocationDetail[] = [
  {
    name: "Sharjah",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3605.4875006911766!2d55.6197734!3d25.3549731!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef5f3cb5a570e99%3A0x88048b89ebc5d2d0!2sGlaze%20Granite%20%26%20Marble%2C%20EIC%20Sharjah%2C%20UAE!5e0!3m2!1sen!2sae!4v1786021470634!5m2!1sen!2sae",
    address: "Plot # 4080,82,83 & 84, Sector - 7, Emirates Industrial City, Sajja, PO Box: 24552 - Sharjah",
    phone: "+971 6 5353 123",
    email: "info@nobilita.com",
    googleMapsUrl: "https://www.google.com/maps/place/Glaze+Granite+%26+Marble,+EIC+Sharjah,+UAE/@25.3549731,55.6197734,17z/data=!4m6!3m5!1s0x3ef5f3cb5a570e99:0x88048b89ebc5d2d0!8m2!3d25.3549731!4d55.6219621!16s%2Fg%2F11b63vwp8y?coh=164777&entry=tt&shorturl=1",
    coordinates: [25.3549731, 55.6197734],
    line1: "Glaze Granite & Marble,",
    line2: "EIC Sharjah, UAE",
  },
  {
    name: "Abu Dhabi",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3636.9811850723454!2d54.461715!3d24.2773877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e3f6e29874ead%3A0x6e7b0f4d7d28f863!2sGlaze%20Granite%20%26%20Marble%2C%20ICAD3%20Abu%20Dhabi%2C%20UAE!5e0!3m2!1sen!2sae!4v1786022158860!5m2!1sen!2sae",
    address: "Plot # 31, WR - 43, PO Box: 32936 - Abu Dhabi",
    phone: "+971 2 5502 390",
    email: "info@nobilita.com",
    googleMapsUrl: "https://www.google.com/maps/place/Glaze+Granite+%26+Marble+Tr.+Est.,+ICAD3,+Abu+Dhabi+-+Plot+%2331-WR43,+ICAD3+-+Abu+Dhabi+Industrial+City+-+%D9%85%D8%B5%D9%81%D8%AD+%D8%AC%D9%86%D9%88%D8%A8+-+Abu+Dhabi%E2%80%AD/data=!4m2!3m1!1s0x3e5e3f6e29874ead:0x6e7b0f4d7d28f863?entry=gps&lucs=karto&g_ep=CAESCTExLjYwLjcwMxgAIIgnKgVrYXJ0b0ICQUU%3D",
    coordinates: [24.2773877, 54.461715],
    line1: "Glaze Granite & Marble,",
    line2: "ICAD3 Abu Dhabi, UAE",
  },
  {
    name: "Dubai",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.13628512845!2d55.2110988!3d25.131082900000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b8f94c9d15b%3A0x52832ec673ef03f1!2sGlaze%20Buildmat%20LLC%2C%20Dubai%2C%20UAE!5e0!3m2!1sen!2sae!4v1786022438284!5m2!1sen!2sae",
    address: "Showroom No. 7, Eiffel 1 Bldg, Sheikh Zayed Rd - Umm Al Sheif - Dubai",
    phone: "+971 4 2651 313",
    email: "info@nobilita.com",
    googleMapsUrl: "https://www.google.com/maps/place/Glaze+Buildmat+LLC,+Dubai,+UAE/@25.1310877,55.2085239,17z/data=!3m1!4b1!4m6!3m5!1s0x3e5f6b8f94c9d15b:0x52832ec673ef03f1!8m2!3d25.1310829!4d55.2110988!16s%2Fg%2F11kh_snxlh?entry=tts",
    coordinates: [25.1310829, 55.2110988],
    line1: "Glaze Buildmat",
    line2: "LLC, Dubai, UAE",
  },
];

// Styled custom icons matching the bronze/orange theme
const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#007190"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 mt-0.5 flex-shrink-0"
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#007190"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 flex-shrink-0"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#007190"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 flex-shrink-0"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export default function LocationsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Locations Title Character Reveal
      gsap.fromTo(
        ".loc-title-char",
        { y: "120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.2,
          stagger: 0.04,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".loc-title-trigger",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Locations Cards Staggered Scale & Slide Up
      gsap.fromTo(
        ".location-card",
        { y: 45, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".loc-grid-trigger",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#fcfbfa] pt-[40px] pb-20 px-6 md:px-12 lg:px-16 border-t border-[#007190]/20">
      <div className="max-w-[1440px] mx-auto">
        {/* Main Section Header */}
        <div className="loc-title-trigger text-center mb-[40px] flex justify-center">
          <h2 className="font-ivymode text-[clamp(28px,4.5vw,66px)] text-[#545759] tracking-[0.2em] uppercase font-light flex flex-wrap justify-center gap-x-[0.3em]">
            {"LOCATIONS".split(" ").map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((char, cIdx) => (
                  <span key={cIdx} className="inline-block overflow-hidden align-bottom py-2 md:py-0 px-[1px]">
                    <span className="loc-title-char inline-block">{char}</span>
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        {/* 3 Locations Grid */}
        <div className="loc-grid-trigger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 xl:gap-12">
          {locationsData.map((loc) => {
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
              loc.googleMapsUrl
            )}`;

            return (
              <div
                key={loc.name}
                className="location-card flex flex-col space-y-6 bg-white p-6 md:p-8 border border-[#007190]/20 hover:border-[#007190]/60 transition-all duration-700 rounded-sm hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,113,144,0.08)]"
              >
                {/* Location Tab Header */}
                <div className="flex justify-center">
                  <h3 className="font-ivymode text-[clamp(22px,2.2vw,28px)] text-[#3d3d3d] tracking-[0.1em] font-light text-center">
                    {loc.name}
                  </h3>
                </div>

                {/* Map Section */}
                <div className="w-full h-[220px] relative overflow-hidden group/map border border-[#007190]/25 rounded-sm">
                  <LeafletMap
                    coordinates={loc.coordinates}
                    title={`${loc.name} Map`}
                    line1={loc.line1}
                    line2={loc.line2}
                    googleMapsUrl={loc.googleMapsUrl}
                    mapEmbedUrl={loc.mapEmbedUrl}
                  />
                </div>

                {/* Location Details and QR Code */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 mt-auto">
                  {/* Left Column: Address, Phone, Fax, Email */}
                  <div className="flex-1 space-y-4">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPinIcon />
                      <span className="font-montserrat text-[13px] leading-relaxed text-[#545759]">
                        {loc.address}
                      </span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <PhoneIcon />
                      <a
                        href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                        className="font-montserrat text-[13px] text-[#545759] hover:text-[#007190] transition-colors"
                      >
                        {loc.phone}
                      </a>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <MailIcon />
                      <a
                        href={`mailto:${loc.email}`}
                        className="font-montserrat text-[13px] text-[#545759] hover:text-[#007190] transition-colors"
                      >
                        {loc.email}
                      </a>
                    </div>
                  </div>

                  {/* Right Column: QR Code & Call to Action */}
                  <div className="flex flex-col items-center text-center self-center sm:self-start shrink-0 w-[100px] space-y-2 select-none">
                    <img
                      src={qrCodeUrl}
                      alt={`Scan for ${loc.name} Map`}
                      className="w-[80px] h-[80px] object-contain"
                      loading="lazy"
                    />
                    <div className="font-montserrat text-[10px] tracking-wide text-[#545759] font-normal leading-relaxed">
                      Scan QR Code
                      <span className="block text-[#545759] text-[9px] mt-0.5">For Map</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
