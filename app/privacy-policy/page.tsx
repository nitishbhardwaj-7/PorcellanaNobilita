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
      privacyBody: s?.privacyBody,
    };
  } catch (e) {
    cmsData = null;
  }
  return <PrivacyPolicyClient cmsData={cmsData} />;
}
