import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT rename a finish or change its order. Protected by middleware.
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
          { success: false, error: "Finish name is required." },
          { status: 400 }
        );
      }
      const existing = await prisma.finish.findUnique({ where: { name: trimmed } });
      if (existing && existing.id !== params.id) {
        return NextResponse.json(
          { success: false, error: "A finish with this name already exists." },
          { status: 409 }
        );
      }

      // Renaming a finish updates every product's finishCategories array that
      // references the old name, so nothing silently falls out of its filter.
      const current = await prisma.finish.findUnique({ where: { id: params.id } });
      if (current && current.name !== trimmed) {
        const affected = await prisma.product.findMany({
          where: { finishCategories: { has: current.name } },
          select: { id: true, finishCategories: true },
        });
        for (const p of affected) {
          await prisma.product.update({
            where: { id: p.id },
            data: {
              finishCategories: p.finishCategories.map((f) => (f === current.name ? trimmed : f)),
            },
          });
        }
      }
    }

    const finish = await prisma.finish.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: finish });
  } catch (error: any) {
    console.error("PUT Finish API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update finish." },
      { status: 500 }
    );
  }
}

// DELETE a finish — blocked if any product currently uses it, so filters and
// product data never silently reference a value that no longer exists.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const finish = await prisma.finish.findUnique({ where: { id: params.id } });
    if (!finish) {
      return NextResponse.json(
        { success: false, error: "Finish not found." },
        { status: 404 }
      );
    }

    const inUseCount = await prisma.product.count({
      where: { finishCategories: { has: finish.name } },
    });
    if (inUseCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `"${finish.name}" is used by ${inUseCount} product${inUseCount !== 1 ? "s" : ""}. Remove it from ${inUseCount !== 1 ? "them" : "it"} first.`,
        },
        { status: 409 }
      );
    }

    await prisma.finish.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Finish API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete finish." },
      { status: 500 }
    );
  }
}
