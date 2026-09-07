import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all homepage finish tiles, ordered — public (the homepage reads this).
export async function GET() {
  try {
    const tiles = await prisma.homeFinishTile.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, data: tiles });
  } catch (error) {
    console.error("GET HomeFinishTiles API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch finish tiles." },
      { status: 500 }
    );
  }
}

// POST create a new finish tile. Protected by middleware (non-GET /api/* requires admin auth).
export async function POST(request: Request) {
  try {
    const { name, filterName, image, desc, textStyle, lightWash } = await request.json();
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.homeFinishTile.aggregate({ _max: { order: true } });
    const tile = await prisma.homeFinishTile.create({
      data: {
        name,
        filterName: filterName || name,
        image: image || "",
        desc: desc || "",
        textStyle: textStyle === "light" ? "light" : "dark",
        lightWash: !!lightWash,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, data: tile }, { status: 201 });
  } catch (error: any) {
    console.error("POST HomeFinishTile API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create finish tile." },
      { status: 500 }
    );
  }
}
