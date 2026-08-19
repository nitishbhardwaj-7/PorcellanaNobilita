import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH — toggle isRead. Admin only (enforced by middleware).
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { isRead } = body;

    const submission = await prisma.submission.update({
      where: { id: params.id },
      data: {
        ...(isRead !== undefined && { isRead }),
      },
    });

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    console.error("PATCH Submission Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update submission." },
      { status: 500 }
    );
  }
}

// DELETE — admin only (enforced by middleware).
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.submission.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete submission." },
      { status: 500 }
    );
  }
}
