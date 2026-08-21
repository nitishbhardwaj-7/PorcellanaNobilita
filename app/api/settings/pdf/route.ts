import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { saveFile } from "@/lib/upload";

// Which downloadable PDF this upload replaces. Whitelisted to prevent writing
// to arbitrary Settings columns.
const SLOT_TO_FIELDS: Record<string, { url: string; name: string }> = {
  catalog: { url: "catalogPdfUrl", name: "catalogPdfName" },
  datasheetEnglish: { url: "datasheetPdfUrlEnglish", name: "datasheetPdfNameEnglish" },
  datasheetItalian: { url: "datasheetPdfUrlItalian", name: "datasheetPdfNameItalian" },
};

// POST replaces one of the site's downloadable PDFs (catalogue or datasheet).
// Protected by middleware (all non-GET /api/* routes require admin auth).
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const slot = formData.get("slot") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    const fields = SLOT_TO_FIELDS[slot];
    if (!fields) {
      return NextResponse.json(
        { success: false, error: "Invalid slot." },
        { status: 400 }
      );
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return NextResponse.json(
        { success: false, error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    const uploadResult = await saveFile(file, "documents");

    const settings = await prisma.settings.upsert({
      where: { id: "global" },
      update: {
        [fields.url]: uploadResult.url,
        [fields.name]: uploadResult.fileName,
      },
      create: {
        id: "global",
        [fields.url]: uploadResult.url,
        [fields.name]: uploadResult.fileName,
      },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("POST Settings PDF API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload PDF." },
      { status: 500 }
    );
  }
}
