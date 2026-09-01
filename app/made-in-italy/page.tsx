import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import MadeInItalyClient from "./MadeInItalyClient";

export async function generateMetadata() {
  return getStaticPageMetadata(
    "made-in-italy",
    "Made in Italy",
    "What Made in Italy means for Porcellana Nobilita — the process, provenance, and quality behind every slab."
  );
}

export default function MadeInItalyPage() {
  return <MadeInItalyClient />;
}
