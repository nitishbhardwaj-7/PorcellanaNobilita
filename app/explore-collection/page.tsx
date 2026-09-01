import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import ExploreCollectionClient from "./ExploreCollectionClient";

export async function generateMetadata() {
  return getStaticPageMetadata(
    "explore-collection",
    "Explore The Collection",
    "Browse the full Porcellana Nobilita slab collection — filter by color and finish to find the perfect Italian porcelain surface."
  );
}

export default function ExploreCollectionPage() {
  return <ExploreCollectionClient />;
}
