import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET the global settings row (public — the site's Footer needs this to know
// which PDF to serve for catalogue/datasheet downloads). Creates the row with
// defaults on first read if it doesn't exist yet.
export async function GET() {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: "global" },
      update: {},
      create: { id: "global" },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("GET Settings API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

// PATCH partial-updates the global settings row. Protected by middleware
// (all non-GET /api/* routes require admin auth).
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const settings = await prisma.settings.upsert({
      where: { id: "global" },
      update: body,
      create: { id: "global", ...body },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("PATCH Settings API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings." },
      { status: 500 }
    );
  }
}
