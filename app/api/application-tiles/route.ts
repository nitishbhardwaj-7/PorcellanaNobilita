import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all six application tiles, ordered — public (the homepage reads this).
export async function GET() {
  try {
    const tiles = await prisma.applicationTile.findMany({
      orderBy: [{ row: "asc" }, { order: "asc" }],
    });
    return NextResponse.json({ success: true, data: tiles });
  } catch (error) {
    console.error("GET ApplicationTiles API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch application tiles." },
      { status: 500 }
    );
  }
}
