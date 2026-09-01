import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all colors, ordered — public (product form + explore-collection filter both read this)
export async function GET() {
  try {
    const colors = await prisma.color.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, data: colors });
  } catch (error) {
    console.error("GET Colors API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch colors." },
      { status: 500 }
    );
  }
}

// POST create a new color. Protected by middleware (non-GET /api/* requires admin auth).
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Color name is required." },
        { status: 400 }
      );
    }

    const trimmed = name.trim();
    const existing = await prisma.color.findUnique({ where: { name: trimmed } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A color with this name already exists." },
        { status: 409 }
      );
    }

    const maxOrder = await prisma.color.aggregate({ _max: { order: true } });
    const color = await prisma.color.create({
      data: { name: trimmed, order: (maxOrder._max.order ?? -1) + 1 },
    });

    return NextResponse.json({ success: true, data: color }, { status: 201 });
  } catch (error: any) {
    console.error("POST Color API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create color." },
      { status: 500 }
    );
  }
}
