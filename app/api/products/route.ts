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

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products." },
      { status: 500 }
    );
  }
}

// POST create product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      color,
      finish,
      thicknessMm,
      dimensions,
      format,
      applications,
      coverImage,
      gallery,
      leftBg,
      faces,
      finishes,
      slides,
      availableFaces,
      bookmatchImg,
      isHorizontalFace,
      isDark,
      order,
      status,
    } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Product name is required." },
        { status: 400 }
      );
    }

    const finalSlug = slug || slugify(name);

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A product with this slug already exists." },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        color: color || "White",
        finish: finish || null,
        thicknessMm: thicknessMm || [],
        dimensions: dimensions || [],
        format: format || null,
        applications: applications || [],
        coverImage: coverImage || null,
        gallery: gallery || [],
        leftBg: leftBg || null,
        faces: faces || [],
        finishes: finishes || [],
        slides: slides || [],
        availableFaces: availableFaces || [],
        bookmatchImg: bookmatchImg || null,
        isHorizontalFace: isHorizontalFace || false,
        isDark: isDark || false,
        order: order ?? 0,
        status: status || "DRAFT",
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error("POST Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product." },
      { status: 500 }
    );
  }
}
