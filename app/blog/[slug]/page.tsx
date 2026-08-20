import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getPageMetadata, generateSchemaScript } from "@/lib/seo";
import BlogDetailView, { BlogPost } from "./BlogDetailView";

import { HARDCODED_BLOGS } from "@/lib/hardcodedBlogs";

export const revalidate = 0; // Ensure fresh content

function toBlogPost(b: any): BlogPost {
  return {
    slug: b.slug,
    title: b.title,
    titleColor: b.titleColor || "black",
    titleFont: b.titleFont || "ivymode",
    titleFontSize: b.titleFontSize || "standard",
    author: b.author,
    authorImage: b.authorImage || "",
    date: (b.publishedAt || b.createdAt || "").toString(),
    readTime: b.readTime || "",
    heroImage: b.heroImage || "",
    heroImageAlt: b.heroImageAlt || b.title,
    content: Array.isArray(b.content) ? b.content : [],
    tag: b.tag || undefined,
    tags: b.tags || [],
    excerpt: b.excerpt || undefined,
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // CMS-managed content always wins over the hardcoded seed data — a hardcoded
  // entry only fills in if the database has nothing for this slug (e.g. DB
  // briefly unreachable), never as a permanent shadow over an edited post.
  let blog: any = null;
  try {
    blog = await prisma.blog.findUnique({ where: { slug: params.slug } });
  } catch (e) {
    blog = null;
  }
  if (!blog) {
    blog = HARDCODED_BLOGS.find((b) => b.slug === params.slug);
  }

  if (!blog || blog.status !== "PUBLISHED") {
    return {};
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nobilita.com";
  return getPageMetadata(
    {
      title: blog.title,
      seoTitle: blog.seoTitle || blog.title,
      metaDescription: blog.seoDescription || blog.excerpt,
      metaKeywords: blog.tags?.join(", "),
      featuredImage: blog.heroImage,
      canonicalUrl: `${appUrl}/blog/${blog.slug}`,
    },
    blog.title,
    appUrl
  );
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  // CMS-managed content always wins over the hardcoded seed data — see note
  // in generateMetadata above.
  let blog: any = null;
  try {
    blog = await prisma.blog.findUnique({ where: { slug: params.slug } });
  } catch (e) {
    blog = null;
  }
  if (!blog) {
    blog = HARDCODED_BLOGS.find((b) => b.slug === params.slug);
  }

  if (!blog || blog.status !== "PUBLISHED") {
    notFound();
  }

  let others: any[] = [];
  try {
    others = await prisma.blog.findMany({
      where: { status: "PUBLISHED", slug: { not: params.slug } },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
      take: 8,
    });
  } catch (e) {
    others = [];
  }

  const otherHcBlogs = HARDCODED_BLOGS.filter((b) => b.slug !== params.slug);
  for (const hc of otherHcBlogs) {
    if (!others.some((o) => o.slug === hc.slug)) {
      others.push(hc);
    }
  }

  const post = toBlogPost(blog);
  const otherPosts = others.map(toBlogPost);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nobilita.com";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.seoDescription || blog.excerpt || undefined,
    image: blog.heroImage ? [blog.heroImage] : undefined,
    datePublished: blog.publishedAt instanceof Date ? blog.publishedAt.toISOString() : (blog.publishedAt || undefined),
    dateModified: blog.updatedAt instanceof Date ? blog.updatedAt.toISOString() : (blog.updatedAt || undefined),
    author: { "@type": "Organization", name: blog.author || "NOBILITA" },
    publisher: {
      "@type": "Organization",
      name: "Porcellana Nobilita",
      logo: { "@type": "ImageObject", url: `${appUrl}/images/NOBILITA_white.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${appUrl}/blog/${blog.slug}` },
    keywords: blog.tags?.length ? blog.tags.join(", ") : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(articleSchema)}
      />
      <BlogDetailView post={post} otherPosts={otherPosts} />
    </>
  );
}
