import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import BlogListClient from "./BlogListClient";

export async function generateMetadata() {
  return getStaticPageMetadata(
    "blog",
    "Blog",
    "News, insights, and inspiration from Porcellana Nobilita."
  );
}

export default function BlogPage() {
  return <BlogListClient />;
}
