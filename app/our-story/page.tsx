import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import OurStoryClient from "./OurStoryClient";

export async function generateMetadata() {
  return getStaticPageMetadata(
    "our-story",
    "Our Story",
    "The story behind Porcellana Nobilita — Italian craftsmanship, heritage, and the vision behind Il Gres Imperiale d'Italia."
  );
}

export default function OurStoryPage() {
  return <OurStoryClient />;
}
