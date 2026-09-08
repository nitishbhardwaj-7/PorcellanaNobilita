import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single newsletter
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: params.id },
    });
    if (!newsletter) {
      return NextResponse.json(
        { success: false, error: "Newsletter not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: newsletter });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch newsletter." },
      { status: 500 }
    );
  }
}

// PUT update newsletter
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      subtitle,
      subtitleColor,
      subtitleFont,
      subtitleSize,
      cardImage,
      heroImage,
      heroImageAlt,
      author,
      specProductName,
      specProductNameColor,
      specProductNameFont,
      specProductNameSize,
      specSlabImage,
      specDimensions,
      specFaces,
      specFinishes,
      specInspirationLine1,
      specInspirationLine2,
      specInspirationColor,
      specInspirationFont,
      specInspirationSize,
      seoTitle,
      seoDescription,
      order,
      status,
      publishedAt,
    } = body;

    // Check slug uniqueness if it's being changed
    if (slug !== undefined) {
      const existing = await prisma.newsletter.findUnique({ where: { slug } });
      if (existing && existing.id !== params.id) {
        return NextResponse.json(
          { success: false, error: "A newsletter with this slug already exists." },
          { status: 409 }
        );
      }
    }

    const newsletter = await prisma.newsletter.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(subtitle !== undefined && { subtitle }),
        ...(subtitleColor !== undefined && { subtitleColor }),
        ...(subtitleFont !== undefined && { subtitleFont }),
        ...(subtitleSize !== undefined && { subtitleSize }),
        ...(cardImage !== undefined && { cardImage }),
        ...(heroImage !== undefined && { heroImage }),
        ...(heroImageAlt !== undefined && { heroImageAlt }),
        ...(author !== undefined && { author }),
        ...(specProductName !== undefined && { specProductName }),
        ...(specProductNameColor !== undefined && { specProductNameColor }),
        ...(specProductNameFont !== undefined && { specProductNameFont }),
        ...(specProductNameSize !== undefined && { specProductNameSize }),
        ...(specSlabImage !== undefined && { specSlabImage }),
        ...(specDimensions !== undefined && { specDimensions }),
        ...(specFaces !== undefined && { specFaces }),
        ...(specFinishes !== undefined && { specFinishes }),
        ...(specInspirationLine1 !== undefined && { specInspirationLine1 }),
        ...(specInspirationLine2 !== undefined && { specInspirationLine2 }),
        ...(specInspirationColor !== undefined && { specInspirationColor }),
        ...(specInspirationFont !== undefined && { specInspirationFont }),
        ...(specInspirationSize !== undefined && { specInspirationSize }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(order !== undefined && { order }),
        ...(status !== undefined && { status }),
        ...(publishedAt !== undefined && { publishedAt: new Date(publishedAt) }),
      },
    });

    return NextResponse.json({ success: true, data: newsletter });
  } catch (error: any) {
    console.error("PUT Newsletter Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update newsletter." },
      { status: 500 }
    );
  }
}

// DELETE newsletter
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.newsletter.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete newsletter." },
      { status: 500 }
    );
  }
}
