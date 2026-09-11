import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT updates one tile's name/image/productName/darkLabel/labelColor/
// labelFont/labelSize. Protected by middleware. Row/order are intentionally
// not editable here — the grid's 3+3 layout is fixed; only each tile's
// content can change.
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, image, productName, darkLabel, labelColor, labelFont, labelSize } = body;

    const tile = await prisma.applicationTile.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(image !== undefined && { image }),
        ...(productName !== undefined && { productName }),
        ...(darkLabel !== undefined && { darkLabel }),
        ...(labelColor !== undefined && { labelColor }),
        ...(labelFont !== undefined && { labelFont }),
        ...(labelSize !== undefined && { labelSize }),
      },
    });

    return NextResponse.json({ success: true, data: tile });
  } catch (error: any) {
    console.error("PUT ApplicationTile API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update tile." },
      { status: 500 }
    );
  }
}
