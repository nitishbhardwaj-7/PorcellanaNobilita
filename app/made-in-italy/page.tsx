import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import MadeInItalyClient from "./MadeInItalyClient";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function generateMetadata() {
  return getStaticPageMetadata(
    "made-in-italy",
    "Made in Italy",
    "What Made in Italy means for Porcellana Nobilita — the process, provenance, and quality behind every slab."
  );
}

export default async function MadeInItalyPage() {
  let cmsData: any = null;
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "global" } });
    cmsData = {
      miHeading: settings?.miHeading,
      miHeadingColor: settings?.miHeadingColor,
      miHeadingFont: settings?.miHeadingFont,
      miHeadingSize: settings?.miHeadingSize,
      miSec1Label: settings?.miSec1Label,
      miSec2Para1: settings?.miSec2Para1,
      miSec2Para1Color: settings?.miSec2Para1Color,
      miSec2Para1Font: settings?.miSec2Para1Font,
      miSec2Para1Size: settings?.miSec2Para1Size,
      miSec2Image: settings?.miSec2Image,
      miSec2ImageLabel: settings?.miSec2ImageLabel,
      miSec3Line1: settings?.miSec3Line1,
      miSec3Line1Color: settings?.miSec3Line1Color,
      miSec3Line1Font: settings?.miSec3Line1Font,
      miSec3Line1Size: settings?.miSec3Line1Size,
      miSec3LeftImage: settings?.miSec3LeftImage,
      miSec3RightImage: settings?.miSec3RightImage,
      miSec3RightImageLabel: settings?.miSec3RightImageLabel,
      miSec3BottomPara: settings?.miSec3BottomPara,
      miSec3BottomParaColor: settings?.miSec3BottomParaColor,
      miSec3BottomParaFont: settings?.miSec3BottomParaFont,
      miSec3BottomParaSize: settings?.miSec3BottomParaSize,
      miSec4BgImage: settings?.miSec4BgImage,
      miSec4BgImageMobile: settings?.miSec4BgImageMobile,
      miSec4Label: settings?.miSec4Label,
    };
  } catch (e) {
    cmsData = null;
  }
  return <MadeInItalyClient cmsData={cmsData} />;
}
