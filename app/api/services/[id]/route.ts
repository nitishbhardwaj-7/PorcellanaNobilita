import { NextResponse } from "next/server";

// Services model has been replaced by Products.
export async function GET() {
  return NextResponse.json({ success: false, error: "Use /api/products instead." }, { status: 410 });
}
export async function PUT() {
  return NextResponse.json({ success: false, error: "Use /api/products instead." }, { status: 410 });
}
export async function DELETE() {
  return NextResponse.json({ success: false, error: "Use /api/products instead." }, { status: 410 });
}
