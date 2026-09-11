import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT update a finish tile's name/filterName/image/desc/style/order. Protected by middleware.
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name, nameFont, nameSize, filterName, image, desc, descColor, descFont, descSize,
      textStyle, lightWash, order,
    } = body;

    const tile = await prisma.homeFinishTile.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(nameFont !== undefined && { nameFont }),
        ...(nameSize !== undefined && { nameSize }),
        ...(filterName !== undefined && { filterName }),
        ...(image !== undefined && { image }),
        ...(desc !== undefined && { desc }),
        ...(descColor !== undefined && { descColor }),
        ...(descFont !== undefined && { descFont }),
        ...(descSize !== undefined && { descSize }),
        ...(textStyle !== undefined && { textStyle: textStyle === "light" ? "light" : "dark" }),
        ...(lightWash !== undefined && { lightWash: !!lightWash }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: tile });
  } catch (error: any) {
    console.error("PUT HomeFinishTile API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update finish tile." },
      { status: 500 }
    );
  }
}

// DELETE a finish tile.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.homeFinishTile.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE HomeFinishTile API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete finish tile." },
      { status: 500 }
    );
  }
}
