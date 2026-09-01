import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT upserts the title/description for one page. Protected by middleware
// (all non-GET /api/* routes require admin auth).
export async function PUT(
  request: Request,
  { params }: { params: { pageKey: string } }
) {
  try {
    const { title, description } = await request.json();

    const row = await prisma.pageMeta.upsert({
      where: { pageKey: params.pageKey },
      update: {
        title: title === undefined ? undefined : (title || null),
        description: description === undefined ? undefined : (description || null),
      },
      create: {
        pageKey: params.pageKey,
        title: title || null,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, data: row });
  } catch (error: any) {
    console.error("PUT PageMeta API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update page title." },
      { status: 500 }
    );
  }
}
