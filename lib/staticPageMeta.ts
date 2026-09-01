import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getPageMetadata } from "@/lib/seo";

/**
 * Builds Next.js metadata for a static (non-CMS-content) page from its
 * Admin > Page Titles row, falling back to the given defaults if the row
 * doesn't exist yet or was left blank.
 */
export async function getStaticPageMetadata(
  pageKey: string,
  fallbackTitle: string,
  fallbackDescription?: string
): Promise<Metadata> {
  let row: { title: string | null; description: string | null } | null = null;
  try {
    row = await prisma.pageMeta.findUnique({
      where: { pageKey },
      select: { title: true, description: true },
    });
  } catch {
    row = null;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nobilita.com";
  const description = row?.description || fallbackDescription || "";

  // The home page's title is the full site tagline already, not a short page
  // name — skip getPageMetadata's "<title> | Porcellana Nobilita" suffixing,
  // which would otherwise double up the branding.
  if (pageKey === "home") {
    const title = row?.title || fallbackTitle;
    return {
      title,
      description,
      alternates: { canonical: appUrl },
      openGraph: { title, description, url: appUrl, siteName: "Porcellana Nobilita", type: "website" },
      twitter: { card: "summary_large_image", title, description },
    };
  }

  return getPageMetadata(
    {
      seoTitle: row?.title || fallbackTitle,
      metaDescription: description,
      canonicalUrl: `${appUrl}/${pageKey}`,
    },
    fallbackTitle,
    appUrl
  );
}
