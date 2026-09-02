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
      miSec1Label: settings?.miSec1Label,
      miSec2Para1: settings?.miSec2Para1,
      miSec2Image: settings?.miSec2Image,
      miSec2ImageLabel: settings?.miSec2ImageLabel,
      miSec3Line1: settings?.miSec3Line1,
      miSec3LeftImage: settings?.miSec3LeftImage,
      miSec3RightImage: settings?.miSec3RightImage,
      miSec3RightImageLabel: settings?.miSec3RightImageLabel,
      miSec3BottomPara: settings?.miSec3BottomPara,
      miSec4BgImage: settings?.miSec4BgImage,
      miSec4BgImageMobile: settings?.miSec4BgImageMobile,
      miSec4Label: settings?.miSec4Label,
    };
  } catch (e) {
    cmsData = null;
  }
  return <MadeInItalyClient cmsData={cmsData} />;
}
