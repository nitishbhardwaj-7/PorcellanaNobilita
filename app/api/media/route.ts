import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { saveFile } from "@/lib/upload";

// GET all media assets
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const media = await prisma.media.findMany({
      where: {
        ...(folder && folder !== "/" && { folder }),
        ...(tag && { tags: { has: tag } }),
        ...(search && {
          fileName: { contains: search, mode: "insensitive" },
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error("GET Media API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch media assets." },
      { status: 500 }
    );
  }
}

// POST upload file
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";
    const alt = (formData.get("alt") as string) || "";
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    const uploadResult = await saveFile(file, folder);

    const mediaEntry = await prisma.media.create({
      data: {
        fileName: uploadResult.fileName,
        fileUrl: uploadResult.url,
        fileType: uploadResult.fileType,
        fileSize: uploadResult.fileSize,
        folder: "/" + folder,
        alt: alt || null,
        tags,
      },
    });

    return NextResponse.json({ success: true, data: mediaEntry }, { status: 201 });
  } catch (error: any) {
    console.error("POST Media API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload media file." },
      { status: 500 }
    );
  }
}
