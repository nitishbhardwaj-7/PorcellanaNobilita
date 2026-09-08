import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getPageMetadata, generateSchemaScript } from "@/lib/seo";
import NewsletterDetailView from "./NewsletterDetailView";
import { HARDCODED_NEWSLETTERS, NewsletterPost } from "@/lib/hardcodedNewsletters";

export const revalidate = 0; // Ensure fresh content

// Accepts either a raw Prisma Newsletter row (flat spec* fields) or an
// already NewsletterPost-shaped HARDCODED_NEWSLETTERS entry (identified by
// having a nested `productSpec`) and normalizes both to the shape
// NewsletterDetailView expects.
function toNewsletterPost(n: any): NewsletterPost {
  if (n.productSpec) return n as NewsletterPost;
  return {
    id: n.slug,
    slug: n.slug,
    title: n.title,
    bannerTagline: "Il Gres Imperiale d'Italia",
    subtitle: n.subtitle || "",
    subtitleColor: n.subtitleColor || undefined,
    subtitleFont: n.subtitleFont || undefined,
    subtitleSize: n.subtitleSize || undefined,
    heroImage: n.heroImage || n.cardImage || "",
    heroImageAlt: n.heroImageAlt || n.title,
    date: (n.publishedAt instanceof Date ? n.publishedAt.toISOString() : n.publishedAt) || n.createdAt || "",
    author: n.author || "NOBILITA Editorial Team",
    productSpec: {
      productName: n.specProductName || n.title,
      productNameColor: n.specProductNameColor || undefined,
      productNameFont: n.specProductNameFont || undefined,
      productNameSize: n.specProductNameSize || undefined,
      slabImage: n.specSlabImage || "",
      dimensions: n.specDimensions || [],
      faces: n.specFaces || [],
      finishes: n.specFinishes || [],
      inspirationLine1: n.specInspirationLine1 || undefined,
      inspirationLine2: n.specInspirationLine2 || undefined,
      inspirationColor: n.specInspirationColor || undefined,
      inspirationFont: n.specInspirationFont || undefined,
      inspirationSize: n.specInspirationSize || undefined,
    },
    content: [],
    seoTitle: n.seoTitle || undefined,
    seoDescription: n.seoDescription || undefined,
  };
}

async function findNewsletter(slug: string): Promise<any> {
  // CMS-managed content always wins over the hardcoded seed data — a
  // hardcoded entry only fills in if the database has nothing for this slug
  // (e.g. DB briefly unreachable, or a launch edition not yet migrated into
  // the CMS), never as a permanent shadow over an edited/CMS-added post.
  let n: any = null;
  try {
    n = await prisma.newsletter.findUnique({ where: { slug } });
  } catch (e) {
    n = null;
  }
  if (!n) {
    n = HARDCODED_NEWSLETTERS.find((h) => h.slug === slug) || null;
  }
  return n;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const n = await findNewsletter(params.slug);
  if (!n || (n.status && n.status !== "PUBLISHED")) return {};

  const post = toNewsletterPost(n);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nobilita.com";
  return getPageMetadata(
    {
      title: post.title,
      seoTitle: post.seoTitle || post.title,
      metaDescription: post.seoDescription || post.subtitle,
      featuredImage: post.heroImage,
      canonicalUrl: `${appUrl}/newsletter/${post.slug}`,
    },
    post.title,
    appUrl
  );
}

export default async function NewsletterDetailPage({ params }: { params: { slug: string } }) {
  const n = await findNewsletter(params.slug);

  // A DB row with DRAFT status is hidden; a hardcoded entry (no status
  // field at all) is always shown, same as before.
  if (!n || (n.status && n.status !== "PUBLISHED")) {
    notFound();
  }

  const post = toNewsletterPost(n);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nobilita.com";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.seoDescription || post.subtitle,
    image: post.heroImage ? [`${appUrl}${post.heroImage}`] : undefined,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Porcellana Nobilita",
      logo: { "@type": "ImageObject", url: `${appUrl}/images/NOBILITA_white.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${appUrl}/newsletter/${post.slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaScript(articleSchema)}
      />
      <NewsletterDetailView post={post} />
    </>
  );
}
