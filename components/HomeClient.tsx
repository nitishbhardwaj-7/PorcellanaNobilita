"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import HeroSection from "@/components/HeroSection";
import BrandIntro from "@/components/BrandIntro";
import LegacySection from "@/components/LegacySection";
import CraftsmanshipSection from "@/components/CraftsmanshipSection";
import DimensionsSection from "@/components/DimensionsSection";
import ApplicationsSection from "@/components/ApplicationsSection";
import FinishesSection from "@/components/FinishesSection";
import TechnicalDataSection from "@/components/TechnicalDataSection";
import LocationsSection from "@/components/LocationsSection";
import Footer from "@/components/Footer";
import FeaturedProduct from "@/components/FeaturedProduct";
// import LanguageSwitcher from "@/components/LanguageSwitcher";

let hasLoadedGlobal = false;

export default function HomeClient({ cmsData }: { cmsData: any }) {
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpenedFromSessionRef = useRef(false);

  useEffect(() => {
    const productName = searchParams?.get("product");
    if (productName) {
      setActiveProduct(productName);
    } else {
      setActiveProduct(null);
    }
  }, [searchParams]);

  const handleProductSelect = (productName: string) => {
    isOpenedFromSessionRef.current = true;
    const params = new URLSearchParams(searchParams.toString());
    params.set("product", productName);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleProductClose = () => {
    if (isOpenedFromSessionRef.current) {
      router.back();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("product");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    isOpenedFromSessionRef.current = false;
  };
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("has_seen_nobilita_loader");
      if (seen === "true" || hasLoadedGlobal) {
        hasLoadedGlobal = true;
        return false;
      }
    }
    return !hasLoadedGlobal;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("has_seen_nobilita_loader");
      if (seen === "true" || hasLoadedGlobal) {
        setIsLoading(false);
        hasLoadedGlobal = true;
        return;
      }
    }

    // Fallback safety timer: force-hide loader after 10 seconds if needed
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
      hasLoadedGlobal = true;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("has_seen_nobilita_loader", "true");
      }
    }, 10000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const d = cmsData || {};

  const handleComplete = () => {
    setIsLoading(false);
    hasLoadedGlobal = true;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("has_seen_nobilita_loader", "true");
    }
  };

  return (
    <main className="w-full min-h-screen bg-white">
      <Loader isLoading={isLoading} onComplete={handleComplete} />
      {/* <LanguageSwitcher isVisible={!isLoading} /> */}
      <BrandIntro
        tagImage={d.brandTagImage}
        tagSubtext={d.brandTagSubtext}
        subtitle={d.brandSubtitle}
        buttonText={d.brandBtn}
        buttonLink={d.brandBtnLink}
        image={d.brandImg}
        isLoaderActive={isLoading}
      />
      <CraftsmanshipSection
        heading={d.craftHeading}
        paragraph={d.craftParagraph}
        bgImage={d.craftBgImage}
        bgImageMobile={d.craftBgImageMobile}
        badgeText={d.craftBadgeText}
        badgeLink={d.craftBadgeLink}
        casaLabel={d.craftCasaLabel}
      />
      <LegacySection
        leftImage={d.legacyLeftImage}
        leftLabel={d.legacyLeftLabel}
        sketchImage={d.legacySketchImage}
        logoImage={d.legacyLogoImage}
        taglineImage={d.legacyTaglineImage}
        rightImage={d.legacyRightImage}
        rightLabel={d.legacyRightLabel}
      />
      <ApplicationsSection
        onTileClick={(prodName) => handleProductSelect(prodName)}
        heading={d.applicationsHeading}
        tiles={d.applicationTiles}
      />
      <DimensionsSection />
      <FinishesSection />
      <HeroSection
        title={d.heroTitle}
        subtitle={d.heroSubtitle}
        buttonText={d.heroBtn}
        buttonLink={d.heroButtonLink}
        slides={d.heroSlides}
      />
      <TechnicalDataSection />
      <LocationsSection />
      <Footer />
      <FeaturedProduct
        activeProduct={activeProduct}
        onClose={handleProductClose}
      />
    </main>
  );
}
