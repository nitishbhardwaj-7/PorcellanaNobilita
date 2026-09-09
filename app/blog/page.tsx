import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import BlogListClient from "./BlogListClient";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function generateMetadata() {
  return getStaticPageMetadata(
    "blog",
    "Blog",
    "News, insights, and inspiration from Porcellana Nobilita."
  );
}

export default async function BlogPage() {
  let cmsData: any = null;
  try {
    const s = await prisma.settings.findUnique({ where: { id: "global" } });
    cmsData = {
      blogHeroImage: s?.blogHeroImage,
      blogHeroTitle: s?.blogHeroTitle,
      blogHeroTitleColor: s?.blogHeroTitleColor,
      blogHeroTitleFont: s?.blogHeroTitleFont,
      blogHeroTitleSize: s?.blogHeroTitleSize,
    };
  } catch (e) {
    cmsData = null;
  }
  return <BlogListClient cmsData={cmsData} />;
}
