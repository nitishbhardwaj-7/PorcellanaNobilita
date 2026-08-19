import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendSubmissionNotification } from "@/lib/email";

const VALID_TYPES = ["QUERY", "CATALOG", "NEWSLETTER", "DATASHEET"];

// GET submissions — admin only (enforced by middleware). Supports ?type=CATALOG filter.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid submission type." },
        { status: 400 }
      );
    }

    const submissions = await prisma.submission.findMany({
      where: type ? { type: type as any } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error("GET Submissions Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions." },
      { status: 500 }
    );
  }
}

// POST create submission — public (site visitors submit these forms without logging in).
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, email, phone, message, product, language, source } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { success: false, error: "A valid submission type is required." },
        { status: 400 }
      );
    }
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email is required." },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        type,
        name: name.trim(),
        email: email.trim(),
        phone: phone ? String(phone).trim() : null,
        message: message ? String(message).trim() : null,
        product: product ? String(product).trim() : null,
        language: language || null,
        source: source || null,
      },
    });

    // Best-effort — never blocks or fails the submission if email isn't configured/fails.
    sendSubmissionNotification({
      type,
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      product: submission.product,
      message: submission.message,
      language: submission.language,
      createdAt: submission.createdAt,
    }).catch(() => {});

    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch (error: any) {
    console.error("POST Submission Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save submission." },
      { status: 500 }
    );
  }
}
