import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET all newsletters
export async function GET() {
  try {
    const newsletters = await prisma.newsletter.findMany({
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: newsletters });
  } catch (error) {
    console.error("GET Newsletters Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch newsletters." },
      { status: 500 }
    );
  }
}

// POST create newsletter
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      subtitle,
      cardImage,
      heroImage,
      heroImageAlt,
      author,
      specProductName,
      specSlabImage,
      specDimensions,
      specFaces,
      specFinishes,
      specInspirationLine1,
      specInspirationLine2,
      seoTitle,
      seoDescription,
      order,
      status,
      publishedAt,
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Newsletter title is required." },
        { status: 400 }
      );
    }

    const finalSlug = slug || slugify(title);

    // Check slug uniqueness
    const existing = await prisma.newsletter.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A newsletter with this slug already exists." },
        { status: 409 }
      );
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        slug: finalSlug,
        subtitle: subtitle || null,
        cardImage: cardImage || null,
        heroImage: heroImage || null,
        heroImageAlt: heroImageAlt || null,
        author: author || "NOBILITA Editorial Team",
        specProductName: specProductName || null,
        specSlabImage: specSlabImage || null,
        specDimensions: specDimensions || [],
        specFaces: specFaces || [],
        specFinishes: specFinishes || [],
        specInspirationLine1: specInspirationLine1 || null,
        specInspirationLine2: specInspirationLine2 || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        order: order ?? 0,
        status: status || "DRAFT",
        ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      },
    });

    return NextResponse.json({ success: true, data: newsletter }, { status: 201 });
  } catch (error: any) {
    console.error("POST Newsletter Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create newsletter." },
      { status: 500 }
    );
  }
}
