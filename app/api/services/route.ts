import { NextResponse } from "next/server";

// Services model has been replaced by Products.
// These routes are kept as stubs to prevent 404 errors.
// Use /api/products instead.

export async function GET() {
  return NextResponse.json({ success: true, data: [] });
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Services have been replaced by Products. Use /api/products." },
    { status: 410 }
  );
}
