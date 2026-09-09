import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all certifications, ordered — public (the Technical Data page reads this).
export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, data: certifications });
  } catch (error) {
    console.error("GET Certifications API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch certifications." },
      { status: 500 }
    );
  }
}

// POST create a new certification. Protected by middleware (non-GET /api/* requires admin auth).
export async function POST(request: Request) {
  try {
    const { title, subtitle, description, logoImage, certFile } = await request.json();
    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.certification.aggregate({ _max: { order: true } });
    const certification = await prisma.certification.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        logoImage: logoImage || null,
        certFile: certFile || null,
        // New certifications start with the Download Certificate button
        // hidden — an admin ticks "Show Download Certificate" to reveal
        // the PDF upload and the public button.
        showDownload: false,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, data: certification }, { status: 201 });
  } catch (error: any) {
    console.error("POST Certification API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create certification." },
      { status: 500 }
    );
  }
}
