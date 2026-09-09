import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT update a certification's fields/order. Protected by middleware.
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      descriptionColor,
      descriptionFont,
      descriptionSize,
      logoImage,
      showDownload,
      certFile,
      order,
    } = body;

    const certification = await prisma.certification.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(descriptionColor !== undefined && { descriptionColor }),
        ...(descriptionFont !== undefined && { descriptionFont }),
        ...(descriptionSize !== undefined && { descriptionSize }),
        ...(logoImage !== undefined && { logoImage }),
        ...(showDownload !== undefined && { showDownload }),
        ...(certFile !== undefined && { certFile }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: certification });
  } catch (error: any) {
    console.error("PUT Certification API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update certification." },
      { status: 500 }
    );
  }
}

// DELETE a certification.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.certification.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Certification API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete certification." },
      { status: 500 }
    );
  }
}
