import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT rename a color or change its order. Protected by middleware.
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, order } = body;

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) {
        return NextResponse.json(
          { success: false, error: "Color name is required." },
          { status: 400 }
        );
      }
      const existing = await prisma.color.findUnique({ where: { name: trimmed } });
      if (existing && existing.id !== params.id) {
        return NextResponse.json(
          { success: false, error: "A color with this name already exists." },
          { status: 409 }
        );
      }

      // Renaming a color updates every product currently using the old name,
      // so nothing silently falls out of the filter it was already tagged under.
      const current = await prisma.color.findUnique({ where: { id: params.id } });
      if (current && current.name !== trimmed) {
        await prisma.product.updateMany({
          where: { color: current.name },
          data: { color: trimmed },
        });
      }
    }

    const color = await prisma.color.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: color });
  } catch (error: any) {
    console.error("PUT Color API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update color." },
      { status: 500 }
    );
  }
}

// DELETE a color — blocked if any product currently uses it, so filters and
// product data never silently reference a value that no longer exists.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const color = await prisma.color.findUnique({ where: { id: params.id } });
    if (!color) {
      return NextResponse.json(
        { success: false, error: "Color not found." },
        { status: 404 }
      );
    }

    const inUseCount = await prisma.product.count({ where: { color: color.name } });
    if (inUseCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `"${color.name}" is used by ${inUseCount} product${inUseCount !== 1 ? "s" : ""}. Reassign ${inUseCount !== 1 ? "them" : "it"} to a different color first.`,
        },
        { status: 409 }
      );
    }

    await prisma.color.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Color API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete color." },
      { status: 500 }
    );
  }
}
