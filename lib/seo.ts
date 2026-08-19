import { Metadata } from "next";

interface SEOData {
  seoTitle?: string | null;
  serviceName?: string | null;
  title?: string | null;
  metaDescription?: string | null;
  shortDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  featuredImage?: string | null;
}

/**
 * Generates an SEO metadata configuration object compatible with Next.js App Router generateMetadata.
 * @param data The service or page object containing SEO properties
 * @param fallbackTitle Title to use if no other titles are defined
 * @param appUrl The base application URL for canonical fallback
 */
export function getPageMetadata(data: SEOData, fallbackTitle: string, appUrl = "https://nobilita.com"): Metadata {
  const cleanTitle = data.seoTitle || data.serviceName || data.title || fallbackTitle;
  const description = data.metaDescription || data.shortDescription || "";
  const keywords = data.metaKeywords || "";
  
  // Set canonical URL
  const canonical = data.canonicalUrl || (data.serviceName ? `${appUrl}/services/${data.title || ""}` : `${appUrl}/${data.title || ""}`);
  
  // Set OG Image URL
  const image = data.ogImage || data.featuredImage || `${appUrl}/og-fallback.jpg`;

  return {
    title: `${cleanTitle} | Porcellana Nobilita`,
    description: description,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: `${cleanTitle} | Porcellana Nobilita`,
      description: description,
      url: canonical,
      siteName: "Porcellana Nobilita",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} | Porcellana Nobilita`,
      description: description,
      images: [image],
    },
  };
}

/**
 * Returns structured schema.org script markup tags as a raw object.
 */
export function generateSchemaScript(schemaMarkup: any) {
  if (!schemaMarkup || Object.keys(schemaMarkup).length === 0) {
    return undefined;
  }
  
  return {
    __html: JSON.stringify(schemaMarkup),
  };
}
