import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import ExploreCollectionClient from "./ExploreCollectionClient";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function generateMetadata() {
  return getStaticPageMetadata(
    "explore-collection",
    "Explore The Collection",
    "Browse the full Porcellana Nobilita slab collection — filter by color and finish to find the perfect Italian porcelain surface."
  );
}

export default async function ExploreCollectionPage() {
  let cmsData: any = null;
  try {
    const s = await prisma.settings.findUnique({ where: { id: "global" } });
    cmsData = {
      exploreHeroTitle: s?.exploreHeroTitle,
      exploreHeroTitleColor: s?.exploreHeroTitleColor,
      exploreHeroTitleFont: s?.exploreHeroTitleFont,
      exploreHeroTitleSize: s?.exploreHeroTitleSize,
      exploreHeroLogo: s?.exploreHeroLogo,
    };
  } catch (e) {
    cmsData = null;
  }
  return <ExploreCollectionClient cmsData={cmsData} />;
}
