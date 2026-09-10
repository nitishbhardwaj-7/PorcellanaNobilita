import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import PrivacyPolicyClient from "./PrivacyPolicyClient";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function generateMetadata() {
  return getStaticPageMetadata(
    "privacy-policy",
    "Privacy Policy",
    "Porcellana Nobilita's privacy policy."
  );
}

export default async function PrivacyPolicyPage() {
  let cmsData: any = null;
  try {
    const s = await prisma.settings.findUnique({ where: { id: "global" } });
    cmsData = {
      privacyHeroTitle: s?.privacyHeroTitle,
      privacyHeroTitleColor: s?.privacyHeroTitleColor,
      privacyHeroTitleFont: s?.privacyHeroTitleFont,
      privacyHeroTitleSize: s?.privacyHeroTitleSize,
      privacyHeroImage: s?.privacyHeroImage,
      privacyIntro: s?.privacyIntro,
      privacySec1Heading: s?.privacySec1Heading,
      privacySec1Item1Heading: s?.privacySec1Item1Heading,
      privacySec1Item1Text: s?.privacySec1Item1Text,
      privacySec1Item2Heading: s?.privacySec1Item2Heading,
      privacySec1Item2Text: s?.privacySec1Item2Text,
      privacySec1Item3Heading: s?.privacySec1Item3Heading,
      privacySec1Item3Text: s?.privacySec1Item3Text,
      privacySec2Heading: s?.privacySec2Heading,
      privacySec2Intro: s?.privacySec2Intro,
      privacySec2Item1: s?.privacySec2Item1,
      privacySec2Item2: s?.privacySec2Item2,
      privacySec2Item3: s?.privacySec2Item3,
      privacySec2Item4: s?.privacySec2Item4,
      privacySec2Item5: s?.privacySec2Item5,
      privacySec3Heading: s?.privacySec3Heading,
      privacySec3Text: s?.privacySec3Text,
      privacySec4Heading: s?.privacySec4Heading,
      privacySec4Text: s?.privacySec4Text,
      privacySec5Heading: s?.privacySec5Heading,
      privacySec5Text: s?.privacySec5Text,
      privacySec6Heading: s?.privacySec6Heading,
      privacySec6Text: s?.privacySec6Text,
    };
  } catch (e) {
    cmsData = null;
  }
  return <PrivacyPolicyClient cmsData={cmsData} />;
}
