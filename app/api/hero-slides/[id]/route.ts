import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT update a hero slide's image/label/textColor/order. Protected by middleware.
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { image, label, textColor, order } = body;

    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data: {
        ...(image !== undefined && { image }),
        ...(label !== undefined && { label }),
        ...(textColor !== undefined && { textColor: textColor === "black" ? "black" : "white" }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: slide });
  } catch (error: any) {
    console.error("PUT HeroSlide API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update hero slide." },
      { status: 500 }
    );
  }
}

// DELETE a hero slide.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.heroSlide.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE HeroSlide API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete hero slide." },
      { status: 500 }
    );
  }
}
