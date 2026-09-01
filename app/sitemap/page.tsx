import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import SitemapClient from "./SitemapClient";

export async function generateMetadata() {
  return getStaticPageMetadata(
    "sitemap",
    "Sitemap",
    "A full sitemap of the Porcellana Nobilita website."
  );
}

export default function SitemapPage() {
  return <SitemapClient />;
}
