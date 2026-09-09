import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all locations, ordered — public (the homepage reads this).
export async function GET() {
  try {
    const locations = await prisma.location.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    console.error("GET Locations API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch locations." },
      { status: 500 }
    );
  }
}

// POST create a new location. Protected by middleware (non-GET /api/* requires admin auth).
export async function POST(request: Request) {
  try {
    const { name, line1, line2, address, phone, email, mapEmbedUrl, googleMapsUrl, lat, lng } =
      await request.json();
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.location.aggregate({ _max: { order: true } });
    const location = await prisma.location.create({
      data: {
        name,
        line1: line1 || null,
        line2: line2 || null,
        address: address || null,
        phone: phone || null,
        email: email || null,
        mapEmbedUrl: mapEmbedUrl || null,
        googleMapsUrl: googleMapsUrl || null,
        lat: lat ?? null,
        lng: lng ?? null,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, data: location }, { status: 201 });
  } catch (error: any) {
    console.error("POST Location API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create location." },
      { status: 500 }
    );
  }
}
