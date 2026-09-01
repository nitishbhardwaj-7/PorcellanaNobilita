import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT update a Technical Data slide's image/label/textColor/order. Protected by middleware.
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { image, label, textColor, order } = body;

    const slide = await prisma.techDataSlide.update({
      where: { id: params.id },
      data: {
        ...(image !== undefined && { image }),
        ...(label !== undefined && { label }),
        ...(textColor !== undefined && { textColor: textColor === "white" ? "white" : "black" }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: slide });
  } catch (error: any) {
    console.error("PUT TechDataSlide API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update technical data slide." },
      { status: 500 }
    );
  }
}

// DELETE a Technical Data slide.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.techDataSlide.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE TechDataSlide API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete technical data slide." },
      { status: 500 }
    );
  }
}
