import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single blog
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
    });
    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog." },
      { status: 500 }
    );
  }
}

// PUT update blog
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      titleColor,
      titleFont,
      slug,
      excerpt,
      author,
      authorImage,
      heroImage,
      heroImageAlt,
      tag,
      tags,
      content,
      readTime,
      seoTitle,
      seoDescription,
      order,
      status,
      publishedAt,
    } = body;

    // Check slug uniqueness if it's being changed
    if (slug !== undefined) {
      const existing = await prisma.blog.findUnique({ where: { slug } });
      if (existing && existing.id !== params.id) {
        return NextResponse.json(
          { success: false, error: "A blog with this slug already exists." },
          { status: 409 }
        );
      }
    }

    const blog = await prisma.blog.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(titleColor !== undefined && { titleColor }),
        ...(titleFont !== undefined && { titleFont }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(author !== undefined && { author }),
        ...(authorImage !== undefined && { authorImage }),
        ...(heroImage !== undefined && { heroImage }),
        ...(heroImageAlt !== undefined && { heroImageAlt }),
        ...(tag !== undefined && { tag }),
        ...(tags !== undefined && { tags }),
        ...(content !== undefined && { content }),
        ...(readTime !== undefined && { readTime }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(order !== undefined && { order }),
        ...(status !== undefined && { status }),
        ...(publishedAt !== undefined && { publishedAt: new Date(publishedAt) }),
      },
    });

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    console.error("PUT Blog Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update blog." },
      { status: 500 }
    );
  }
}

// DELETE blog
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.blog.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete blog." },
      { status: 500 }
    );
  }
}
