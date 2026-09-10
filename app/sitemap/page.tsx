import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import SitemapClient from "./SitemapClient";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function generateMetadata() {
  return getStaticPageMetadata(
    "sitemap",
    "Sitemap",
    "A full sitemap of the Porcellana Nobilita website."
  );
}

export default async function SitemapPage() {
  let cmsData: any = null;
  let products: { id: string; name: string }[] = [];
  try {
    const [s, publishedProducts] = await Promise.all([
      prisma.settings.findUnique({ where: { id: "global" } }),
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, name: true },
        orderBy: { order: "asc" },
      }),
    ]);
    cmsData = {
      sitemapHeroTitle: s?.sitemapHeroTitle,
      sitemapHeroTitleColor: s?.sitemapHeroTitleColor,
      sitemapHeroTitleFont: s?.sitemapHeroTitleFont,
      sitemapHeroTitleSize: s?.sitemapHeroTitleSize,
      sitemapHeroImage: s?.sitemapHeroImage,
    };
    products = publishedProducts;
  } catch (e) {
    cmsData = null;
  }
  return <SitemapClient cmsData={cmsData} products={products} />;
}
