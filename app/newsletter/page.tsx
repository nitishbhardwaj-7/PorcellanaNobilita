import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import NewsletterClient from "./NewsletterClient";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function generateMetadata() {
  return getStaticPageMetadata(
    "newsletter",
    "Newsletter",
    "Subscribe to the Porcellana Nobilita newsletter for the latest updates."
  );
}

export default async function NewsletterPage() {
  let cmsData: any = null;
  try {
    const s = await prisma.settings.findUnique({ where: { id: "global" } });
    cmsData = {
      newsletterHeroImage: s?.newsletterHeroImage,
      newsletterHeroTitle: s?.newsletterHeroTitle,
      newsletterHeroTitleColor: s?.newsletterHeroTitleColor,
      newsletterHeroTitleFont: s?.newsletterHeroTitleFont,
      newsletterHeroTitleSize: s?.newsletterHeroTitleSize,
    };
  } catch (e) {
    cmsData = null;
  }
  return <NewsletterClient cmsData={cmsData} />;
}
