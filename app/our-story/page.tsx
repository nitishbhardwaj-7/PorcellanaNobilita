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
      storyHeroTitleColor: settings?.storyHeroTitleColor,
      storyHeroTitleFont: settings?.storyHeroTitleFont,
      storyHeroTitleSize: settings?.storyHeroTitleSize,
      storyHeroPara1: settings?.storyHeroPara1,
      storyHeroPara1Color: settings?.storyHeroPara1Color,
      storyHeroPara1Font: settings?.storyHeroPara1Font,
      storyHeroPara1Size: settings?.storyHeroPara1Size,
      storyHeroPara2: settings?.storyHeroPara2,
      storyHeroPara2Color: settings?.storyHeroPara2Color,
      storyHeroPara2Font: settings?.storyHeroPara2Font,
      storyHeroPara2Size: settings?.storyHeroPara2Size,
      storySec2Heading: settings?.storySec2Heading,
      storySec2HeadingColor: settings?.storySec2HeadingColor,
      storySec2HeadingFont: settings?.storySec2HeadingFont,
      storySec2HeadingSize: settings?.storySec2HeadingSize,
      storySec2Line1: settings?.storySec2Line1,
      storySec2Line1Color: settings?.storySec2Line1Color,
      storySec2Line1Font: settings?.storySec2Line1Font,
      storySec2Line1Size: settings?.storySec2Line1Size,
      storySec2Line3: settings?.storySec2Line3,
      storySec2Line3Color: settings?.storySec2Line3Color,
      storySec2Line3Font: settings?.storySec2Line3Font,
      storySec2Line3Size: settings?.storySec2Line3Size,
      storySec2BgImage: settings?.storySec2BgImage,
      storySec2Image: settings?.storySec2Image,
      storySec2BtnText: settings?.storySec2BtnText,
      storySec2ProductName: settings?.storySec2ProductName,
      storySec3Para: settings?.storySec3Para,
      storySec3ParaColor: settings?.storySec3ParaColor,
      storySec3ParaFont: settings?.storySec3ParaFont,
      storySec3ParaSize: settings?.storySec3ParaSize,
      storySec3BtnText: settings?.storySec3BtnText,
      storySec3ProductName: settings?.storySec3ProductName,
      storySec4Heading: settings?.storySec4Heading,
      storySec4HeadingColor: settings?.storySec4HeadingColor,
      storySec4HeadingFont: settings?.storySec4HeadingFont,
      storySec4HeadingSize: settings?.storySec4HeadingSize,
      storySec4Line1: settings?.storySec4Line1,
      storySec4Line1Color: settings?.storySec4Line1Color,
      storySec4Line1Font: settings?.storySec4Line1Font,
      storySec4Line1Size: settings?.storySec4Line1Size,
      storySec4Line2: settings?.storySec4Line2,
      storySec4Line2Color: settings?.storySec4Line2Color,
      storySec4Line2Font: settings?.storySec4Line2Font,
      storySec4Line2Size: settings?.storySec4Line2Size,
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
