import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import TechnicalDataClient from "./TechnicalDataClient";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function generateMetadata() {
  return getStaticPageMetadata(
    "technical-data",
    "Technical Resources",
    "Technical specifications, thicknesses, and care guidance for Porcellana Nobilita's porcelain slabs."
  );
}

export default async function TechnicalDataPage() {
  let cmsData: any = null;
  try {
    const s = await prisma.settings.findUnique({ where: { id: "global" } });
    cmsData = {
      tdHeading: s?.tdHeading,
      tdHeroDesc: s?.tdHeroDesc,
      tdCharHeading: s?.tdCharHeading,
      tdChar1Title: s?.tdChar1Title, tdChar1Desc: s?.tdChar1Desc, tdChar1Icon: s?.tdChar1Icon,
      tdChar2Title: s?.tdChar2Title, tdChar2Desc: s?.tdChar2Desc, tdChar2Icon: s?.tdChar2Icon,
      tdChar3Title: s?.tdChar3Title, tdChar3Desc: s?.tdChar3Desc, tdChar3Icon: s?.tdChar3Icon,
      tdChar4Title: s?.tdChar4Title, tdChar4Desc: s?.tdChar4Desc, tdChar4Icon: s?.tdChar4Icon,
      tdChar5Title: s?.tdChar5Title, tdChar5Desc: s?.tdChar5Desc, tdChar5Icon: s?.tdChar5Icon,
      tdChar6Title: s?.tdChar6Title, tdChar6Desc: s?.tdChar6Desc, tdChar6Icon: s?.tdChar6Icon,
      tdChar7Title: s?.tdChar7Title, tdChar7Desc: s?.tdChar7Desc, tdChar7Icon: s?.tdChar7Icon,
      tdChar8Title: s?.tdChar8Title, tdChar8Desc: s?.tdChar8Desc, tdChar8Icon: s?.tdChar8Icon,
      tdChar9Title: s?.tdChar9Title, tdChar9Desc: s?.tdChar9Desc, tdChar9Icon: s?.tdChar9Icon,
      tdUgHeading: s?.tdUgHeading,
      tdUgDesc1: s?.tdUgDesc1,
      tdUgDesc2: s?.tdUgDesc2,
      tdDimHeading: s?.tdDimHeading,
      tdDimDesc1: s?.tdDimDesc1,
      tdDimDesc2: s?.tdDimDesc2,
      tdDimDesc3: s?.tdDimDesc3,
      tdThickHeading: s?.tdThickHeading,
      tdThickDesc1: s?.tdThickDesc1,
      tdThickDesc2: s?.tdThickDesc2,
      tdSpecsHeading: s?.tdSpecsHeading,
    };
  } catch (e) {
    cmsData = null;
  }
  return <TechnicalDataClient cmsData={cmsData} />;
}
