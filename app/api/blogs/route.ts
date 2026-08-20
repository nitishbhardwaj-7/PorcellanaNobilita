import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET all blogs
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error("GET Blogs Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs." },
      { status: 500 }
    );
  }
}

// POST create blog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      titleColor,
      titleFont,
      titleFontSize,
      showDateOnCard,
      showAuthorOnCard,
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

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Blog title is required." },
        { status: 400 }
      );
    }

    const finalSlug = slug || slugify(title);

    // Check slug uniqueness
    const existing = await prisma.blog.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A blog with this slug already exists." },
        { status: 409 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        titleColor: titleColor || "black",
        titleFont: titleFont || "ivymode",
        titleFontSize: titleFontSize || "standard",
        showDateOnCard: showDateOnCard ?? true,
        showAuthorOnCard: showAuthorOnCard ?? true,
        slug: finalSlug,
        excerpt: excerpt || null,
        author: author || "NOBILITA Editorial Team",
        authorImage: authorImage || null,
        heroImage: heroImage || null,
        heroImageAlt: heroImageAlt || null,
        tag: tag || null,
        tags: tags || [],
        content: content || [],
        readTime: readTime || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        order: order ?? 0,
        status: status || "DRAFT",
        ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      },
    });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error: any) {
    console.error("POST Blog Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create blog." },
      { status: 500 }
    );
  }
}
