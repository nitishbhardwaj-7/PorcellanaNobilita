import React, { Suspense } from "react";
import HomeClient from "@/components/HomeClient";
import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import prisma from "@/lib/prisma";

export const revalidate = 0; // Ensure fresh data on every request

export async function generateMetadata() {
  return getStaticPageMetadata(
    "home",
    "Porcellana Nobilita — IL GRES IMPERIALE D'ITALIA",
    "Luxury Italian porcelain slabs — Nobilita's imperial gres, crafted in Italy for architects, designers and discerning homeowners."
  );
}

export default async function Home() {
  // Homepage Hero content (Admin > Homepage) — fetched server-side so it's
  // ready on first paint, no client-side loading flash. Falls back to
  // HeroSection's own hardcoded defaults if the DB is briefly unreachable.
  let cmsData: any = null;
  try {
    const [settings, heroSlides] = await Promise.all([
      prisma.settings.findUnique({ where: { id: "global" } }),
      prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
    ]);
    cmsData = {
      heroTitle: settings?.heroTitle,
      heroSubtitle: settings?.heroSubtitle,
      heroBtn: settings?.heroButtonText,
      heroButtonLink: settings?.heroButtonLink,
      heroSlides: heroSlides.length > 0 ? heroSlides : undefined,
      brandTagImage: settings?.brandTagImage,
      brandTagSubtext: settings?.brandTagSubtext,
      brandSubtitle: settings?.brandSubtitle,
      brandBtn: settings?.brandBtn,
      brandBtnLink: settings?.brandBtnLink,
      brandImg: settings?.brandImg,
      craftHeading: settings?.craftHeading,
      craftParagraph: settings?.craftParagraph,
      craftBgImage: settings?.craftBgImage,
      craftBgImageMobile: settings?.craftBgImageMobile,
      craftBadgeText: settings?.craftBadgeText,
      craftBadgeLink: settings?.craftBadgeLink,
      craftCasaLabel: settings?.craftCasaLabel,
      legacyLeftImage: settings?.legacyLeftImage,
      legacyLeftLabel: settings?.legacyLeftLabel,
      legacySketchImage: settings?.legacySketchImage,
      legacyLogoImage: settings?.legacyLogoImage,
      legacyTaglineImage: settings?.legacyTaglineImage,
      legacyRightImage: settings?.legacyRightImage,
      legacyRightLabel: settings?.legacyRightLabel,
    };
  } catch (e) {
    cmsData = null;
  }

  return (
    <Suspense fallback={null}>
      <HomeClient cmsData={cmsData} />
    </Suspense>
  );
}
