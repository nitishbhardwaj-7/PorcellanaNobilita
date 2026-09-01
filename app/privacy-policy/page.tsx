import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export async function generateMetadata() {
  return getStaticPageMetadata(
    "privacy-policy",
    "Privacy Policy",
    "Porcellana Nobilita's privacy policy."
  );
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
