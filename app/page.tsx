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
    const [settings, heroSlides, applicationTiles] = await Promise.all([
      prisma.settings.findUnique({ where: { id: "global" } }),
      prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
      prisma.applicationTile.findMany({ orderBy: [{ row: "asc" }, { order: "asc" }] }),
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
      applicationsHeading: settings?.applicationsHeading,
      applicationTiles: applicationTiles.length > 0 ? applicationTiles : undefined,
      dimHeading: settings?.dimHeading,
      dimCol1Header: settings?.dimCol1Header,
      dimCol1Item1: settings?.dimCol1Item1,
      dimCol1Item2: settings?.dimCol1Item2,
      dimCol2Header: settings?.dimCol2Header,
      dimCol2Item1: settings?.dimCol2Item1,
      dimCol2Item2: settings?.dimCol2Item2,
      dimCol3Header: settings?.dimCol3Header,
      dimCol3Item1: settings?.dimCol3Item1,
      dimCol3Item2: settings?.dimCol3Item2,
      dimImage: settings?.dimImage,
      dimBtnText: settings?.dimBtnText,
      dimBtnLink: settings?.dimBtnLink,
      finishesHeading: settings?.finishesHeading,
      finish1Name: settings?.finish1Name,
      finish1Image: settings?.finish1Image,
      finish1Desc: settings?.finish1Desc,
      finish2Name: settings?.finish2Name,
      finish2Image: settings?.finish2Image,
      finish2Desc: settings?.finish2Desc,
      finish3Name: settings?.finish3Name,
      finish3Image: settings?.finish3Image,
      finish3Desc: settings?.finish3Desc,
      finish4Name: settings?.finish4Name,
      finish4Image: settings?.finish4Image,
      finish4Desc: settings?.finish4Desc,
      finish5Name: settings?.finish5Name,
      finish5Image: settings?.finish5Image,
      finish5Desc: settings?.finish5Desc,
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
