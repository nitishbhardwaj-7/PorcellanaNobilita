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
    const [settings, heroSlides, applicationTiles, techDataSlides, finishTiles, locations] = await Promise.all([
      prisma.settings.findUnique({ where: { id: "global" } }),
      prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
      prisma.applicationTile.findMany({ orderBy: [{ row: "asc" }, { order: "asc" }] }),
      prisma.techDataSlide.findMany({ orderBy: { order: "asc" } }),
      prisma.homeFinishTile.findMany({ orderBy: { order: "asc" } }),
      prisma.location.findMany({ orderBy: { order: "asc" } }),
    ]);
    cmsData = {
      heroTitle: settings?.heroTitle,
      heroTitleColor: settings?.heroTitleColor,
      heroTitleFont: settings?.heroTitleFont,
      heroTitleSize: settings?.heroTitleSize,
      heroSubtitle: settings?.heroSubtitle,
      heroSubtitleColor: settings?.heroSubtitleColor,
      heroSubtitleFont: settings?.heroSubtitleFont,
      heroSubtitleSize: settings?.heroSubtitleSize,
      heroBtn: settings?.heroButtonText,
      heroButtonLink: settings?.heroButtonLink,
      heroSlides: heroSlides.length > 0 ? heroSlides : undefined,
      brandTagImage: settings?.brandTagImage,
      brandTagSubtext: settings?.brandTagSubtext,
      brandTagSubtextColor: settings?.brandTagSubtextColor,
      brandTagSubtextFont: settings?.brandTagSubtextFont,
      brandTagSubtextSize: settings?.brandTagSubtextSize,
      brandSubtitle: settings?.brandSubtitle,
      brandSubtitleColor: settings?.brandSubtitleColor,
      brandSubtitleFont: settings?.brandSubtitleFont,
      brandSubtitleSize: settings?.brandSubtitleSize,
      brandBtn: settings?.brandBtn,
      brandBtnLink: settings?.brandBtnLink,
      socialWhatsapp: settings?.socialWhatsapp,
      socialInstagram: settings?.socialInstagram,
      socialFacebook: settings?.socialFacebook,
      socialLinkedin: settings?.socialLinkedin,
      brandImg: settings?.brandImg,
      craftHeading: settings?.craftHeading,
      craftHeadingColor: settings?.craftHeadingColor,
      craftHeadingFont: settings?.craftHeadingFont,
      craftHeadingSize: settings?.craftHeadingSize,
      craftParagraph: settings?.craftParagraph,
      craftParagraphColor: settings?.craftParagraphColor,
      craftParagraphFont: settings?.craftParagraphFont,
      craftParagraphSize: settings?.craftParagraphSize,
      craftBgImage: settings?.craftBgImage,
      craftBgImageMobile: settings?.craftBgImageMobile,
      craftBadgeText: settings?.craftBadgeText,
      craftBadgeLink: settings?.craftBadgeLink,
      craftCasaLabel: settings?.craftCasaLabel,
      craftCasaLabelColor: settings?.craftCasaLabelColor,
      craftCasaLabelFont: settings?.craftCasaLabelFont,
      craftCasaLabelSize: settings?.craftCasaLabelSize,
      legacyLeftImage: settings?.legacyLeftImage,
      legacyLeftLabel: settings?.legacyLeftLabel,
      legacyLeftLabelColor: settings?.legacyLeftLabelColor,
      legacyLeftLabelFont: settings?.legacyLeftLabelFont,
      legacyLeftLabelSize: settings?.legacyLeftLabelSize,
      legacySketchImage: settings?.legacySketchImage,
      legacyLogoImage: settings?.legacyLogoImage,
      legacyTaglineImage: settings?.legacyTaglineImage,
      legacyRightImage: settings?.legacyRightImage,
      legacyRightLabel: settings?.legacyRightLabel,
      legacyRightLabelColor: settings?.legacyRightLabelColor,
      legacyRightLabelFont: settings?.legacyRightLabelFont,
      legacyRightLabelSize: settings?.legacyRightLabelSize,
      applicationsHeading: settings?.applicationsHeading,
      applicationsHeadingColor: settings?.applicationsHeadingColor,
      applicationsHeadingFont: settings?.applicationsHeadingFont,
      applicationsHeadingSize: settings?.applicationsHeadingSize,
      applicationTiles: applicationTiles.length > 0 ? applicationTiles : undefined,
      dimHeading: settings?.dimHeading,
      dimHeadingColor: settings?.dimHeadingColor,
      dimHeadingFont: settings?.dimHeadingFont,
      dimHeadingSize: settings?.dimHeadingSize,
      dimCol1Header: settings?.dimCol1Header,
      dimCol1HeaderColor: settings?.dimCol1HeaderColor,
      dimCol1HeaderFont: settings?.dimCol1HeaderFont,
      dimCol1HeaderSize: settings?.dimCol1HeaderSize,
      dimCol1Item1: settings?.dimCol1Item1,
      dimCol1Item1Color: settings?.dimCol1Item1Color,
      dimCol1Item1Font: settings?.dimCol1Item1Font,
      dimCol1Item1Size: settings?.dimCol1Item1Size,
      dimCol1Item2: settings?.dimCol1Item2,
      dimCol1Item2Color: settings?.dimCol1Item2Color,
      dimCol1Item2Font: settings?.dimCol1Item2Font,
      dimCol1Item2Size: settings?.dimCol1Item2Size,
      dimCol2Header: settings?.dimCol2Header,
      dimCol2HeaderColor: settings?.dimCol2HeaderColor,
      dimCol2HeaderFont: settings?.dimCol2HeaderFont,
      dimCol2HeaderSize: settings?.dimCol2HeaderSize,
      dimCol2Item1: settings?.dimCol2Item1,
      dimCol2Item1Color: settings?.dimCol2Item1Color,
      dimCol2Item1Font: settings?.dimCol2Item1Font,
      dimCol2Item1Size: settings?.dimCol2Item1Size,
      dimCol2Item2: settings?.dimCol2Item2,
      dimCol2Item2Color: settings?.dimCol2Item2Color,
      dimCol2Item2Font: settings?.dimCol2Item2Font,
      dimCol2Item2Size: settings?.dimCol2Item2Size,
      dimCol3Header: settings?.dimCol3Header,
      dimCol3HeaderColor: settings?.dimCol3HeaderColor,
      dimCol3HeaderFont: settings?.dimCol3HeaderFont,
      dimCol3HeaderSize: settings?.dimCol3HeaderSize,
      dimCol3Item1: settings?.dimCol3Item1,
      dimCol3Item1Color: settings?.dimCol3Item1Color,
      dimCol3Item1Font: settings?.dimCol3Item1Font,
      dimCol3Item1Size: settings?.dimCol3Item1Size,
      dimCol3Item2: settings?.dimCol3Item2,
      dimCol3Item2Color: settings?.dimCol3Item2Color,
      dimCol3Item2Font: settings?.dimCol3Item2Font,
      dimCol3Item2Size: settings?.dimCol3Item2Size,
      dimImage: settings?.dimImage,
      dimBtnText: settings?.dimBtnText,
      dimBtnLink: settings?.dimBtnLink,
      finishesHeading: settings?.finishesHeading,
      finishesHeadingColor: settings?.finishesHeadingColor,
      finishesHeadingFont: settings?.finishesHeadingFont,
      finishesHeadingSize: settings?.finishesHeadingSize,
      finishTiles: finishTiles.length > 0 ? finishTiles : undefined,
      techDataSlides: techDataSlides.length > 0 ? techDataSlides : undefined,
      locations: locations.length > 0 ? locations : undefined,
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
