import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import OurStoryClient from "./OurStoryClient";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function generateMetadata() {
  return getStaticPageMetadata(
    "our-story",
    "Our Story",
    "The story behind Porcellana Nobilita — Italian craftsmanship, heritage, and the vision behind Il Gres Imperiale d'Italia."
  );
}

export default async function OurStoryPage() {
  let cmsData: any = null;
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "global" } });
    cmsData = {
      storyHeroTitle: settings?.storyHeroTitle,
      storyHeroPara1: settings?.storyHeroPara1,
      storyHeroPara2: settings?.storyHeroPara2,
      storySec2Heading: settings?.storySec2Heading,
      storySec2Line1: settings?.storySec2Line1,
      storySec2Line3: settings?.storySec2Line3,
      storySec2BgImage: settings?.storySec2BgImage,
      storySec2Image: settings?.storySec2Image,
      storySec2BtnText: settings?.storySec2BtnText,
      storySec2ProductName: settings?.storySec2ProductName,
      storySec3Para: settings?.storySec3Para,
      storySec3BtnText: settings?.storySec3BtnText,
      storySec3ProductName: settings?.storySec3ProductName,
      storySec4Heading: settings?.storySec4Heading,
      storySec4Line1: settings?.storySec4Line1,
      storySec4Line2: settings?.storySec4Line2,
      storySec4BgImage: settings?.storySec4BgImage,
      storySec4Image: settings?.storySec4Image,
      storySec4BtnText: settings?.storySec4BtnText,
      storySec4ProductName: settings?.storySec4ProductName,
    };
  } catch (e) {
    cmsData = null;
  }
  return <OurStoryClient cmsData={cmsData} />;
}
