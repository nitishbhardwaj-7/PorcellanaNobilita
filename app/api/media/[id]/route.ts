import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteFile } from "@/lib/upload";

// GET single media asset
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) {
      return NextResponse.json({ success: false, error: "Media asset not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch media asset." }, { status: 500 });
  }
}

// PATCH update alt text / tags
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { alt, tags } = body;

    const media = await prisma.media.update({
      where: { id: params.id },
      data: {
        ...(alt !== undefined && { alt }),
        ...(tags !== undefined && { tags }),
      },
    });

    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update media asset." }, { status: 500 });
  }
}

// DELETE media asset
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ success: false, error: "Media asset not found." }, { status: 404 });
    }

    await deleteFile(media.fileUrl);
    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Media asset deleted successfully." });
  } catch (error) {
    console.error("DELETE Media API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete media asset." }, { status: 500 });
  }
}
