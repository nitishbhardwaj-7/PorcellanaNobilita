import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all hero slides, ordered — public (the homepage reads this).
export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.error("GET HeroSlides API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero slides." },
      { status: 500 }
    );
  }
}

// POST create a new hero slide. Protected by middleware (non-GET /api/* requires admin auth).
export async function POST(request: Request) {
  try {
    const { image, label, textColor } = await request.json();
    if (!label) {
      return NextResponse.json(
        { success: false, error: "Label is required." },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.heroSlide.aggregate({ _max: { order: true } });
    const slide = await prisma.heroSlide.create({
      data: {
        image: image || "",
        label,
        textColor: textColor === "black" ? "black" : "white",
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, data: slide }, { status: 201 });
  } catch (error: any) {
    console.error("POST HeroSlide API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create hero slide." },
      { status: 500 }
    );
  }
}
