import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import NewsletterClient from "./NewsletterClient";

export async function generateMetadata() {
  return getStaticPageMetadata(
    "newsletter",
    "Newsletter",
    "Subscribe to the Porcellana Nobilita newsletter for the latest updates."
  );
}

export default function NewsletterPage() {
  return <NewsletterClient />;
}
