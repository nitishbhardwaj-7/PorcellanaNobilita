import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all finishes, ordered — public (product form + explore-collection filter both read this)
export async function GET() {
  try {
    const finishes = await prisma.finish.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, data: finishes });
  } catch (error) {
    console.error("GET Finishes API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch finishes." },
      { status: 500 }
    );
  }
}

// POST create a new finish. Protected by middleware (non-GET /api/* requires admin auth).
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Finish name is required." },
        { status: 400 }
      );
    }

    const trimmed = name.trim();
    const existing = await prisma.finish.findUnique({ where: { name: trimmed } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A finish with this name already exists." },
        { status: 409 }
      );
    }

    const maxOrder = await prisma.finish.aggregate({ _max: { order: true } });
    const finish = await prisma.finish.create({
      data: { name: trimmed, order: (maxOrder._max.order ?? -1) + 1 },
    });

    return NextResponse.json({ success: true, data: finish }, { status: 201 });
  } catch (error: any) {
    console.error("POST Finish API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create finish." },
      { status: 500 }
    );
  }
}
