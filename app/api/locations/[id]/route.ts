import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT update a location's fields/order. Protected by middleware.
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      line1,
      line2,
      address,
      phone,
      email,
      mapEmbedUrl,
      googleMapsUrl,
      lat,
      lng,
      order,
    } = body;

    const location = await prisma.location.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(line1 !== undefined && { line1 }),
        ...(line2 !== undefined && { line2 }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(mapEmbedUrl !== undefined && { mapEmbedUrl }),
        ...(googleMapsUrl !== undefined && { googleMapsUrl }),
        ...(lat !== undefined && { lat }),
        ...(lng !== undefined && { lng }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: location });
  } catch (error: any) {
    console.error("PUT Location API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update location." },
      { status: 500 }
    );
  }
}

// DELETE a location.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.location.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Location API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete location." },
      { status: 500 }
    );
  }
}
