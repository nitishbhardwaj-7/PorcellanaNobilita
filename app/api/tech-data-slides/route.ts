import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all Technical Data slides, ordered — public (the homepage reads this).
export async function GET() {
  try {
    const slides = await prisma.techDataSlide.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.error("GET TechDataSlides API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch technical data slides." },
      { status: 500 }
    );
  }
}

// POST create a new Technical Data slide. Protected by middleware (non-GET /api/* requires admin auth).
export async function POST(request: Request) {
  try {
    const { image, label, textColor } = await request.json();
    if (!label) {
      return NextResponse.json(
        { success: false, error: "Label is required." },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.techDataSlide.aggregate({ _max: { order: true } });
    const slide = await prisma.techDataSlide.create({
      data: {
        image: image || "",
        label,
        textColor: textColor === "white" ? "white" : "black",
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, data: slide }, { status: 201 });
  } catch (error: any) {
    console.error("POST TechDataSlide API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create technical data slide." },
      { status: 500 }
    );
  }
}
