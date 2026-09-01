import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// The full set of manageable pages. A page not yet in the DB still shows up
// here (with null title/description) so the admin can fill it in for the
// first time — the row gets created on first save via the [pageKey] route.
const PAGE_DEFS: { pageKey: string; label: string }[] = [
  { pageKey: "home", label: "Home" },
  { pageKey: "our-story", label: "Our Story" },
  { pageKey: "made-in-italy", label: "Made in Italy" },
  { pageKey: "technical-data", label: "Technical Resources" },
  { pageKey: "explore-collection", label: "Explore The Collection" },
  { pageKey: "blog", label: "Blog" },
  { pageKey: "newsletter", label: "Newsletter" },
  { pageKey: "privacy-policy", label: "Privacy Policy" },
  { pageKey: "sitemap", label: "Sitemap" },
];

// GET all page-meta rows, merged with the full page list so every manageable
// page appears even before it has a row of its own. Public (harmless to read).
export async function GET() {
  try {
    const rows = await prisma.pageMeta.findMany();
    const byKey = new Map(rows.map((r) => [r.pageKey, r]));

    const data = PAGE_DEFS.map((def) => {
      const row = byKey.get(def.pageKey);
      return {
        pageKey: def.pageKey,
        label: def.label,
        title: row?.title ?? null,
        description: row?.description ?? null,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET PageMeta API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page titles." },
      { status: 500 }
    );
  }
}
