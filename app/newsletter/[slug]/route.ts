import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// Serves an uploaded newsletter HTML file byte-for-byte at /newsletter/[slug]
// — a plain Route Handler rather than a page, so the file's own
// <html>/<head>/<body> (and its own background/fonts/styles, typical of an
// email-campaign export) render exactly as uploaded, with none of the
// site's own layout, Navbar, or Footer wrapped around it.
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  let newsletter: any = null;
  try {
    newsletter = await prisma.newsletter.findUnique({ where: { slug: params.slug } });
  } catch (e) {
    newsletter = null;
  }

  if (!newsletter || newsletter.status !== "PUBLISHED" || !newsletter.htmlFile) {
    return new NextResponse("Newsletter not found.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  let html: string;
  try {
    if (newsletter.htmlFile.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", newsletter.htmlFile);
      html = await fs.readFile(filePath, "utf-8");
    } else {
      // An external URL was pasted in manually instead of uploading a file.
      const res = await fetch(newsletter.htmlFile);
      if (!res.ok) throw new Error(`Fetch failed with ${res.status}`);
      html = await res.text();
    }
  } catch (e) {
    console.error("Newsletter HTML file read error:", e);
    return new NextResponse("This newsletter's file could not be loaded.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Best-effort SEO polish — the uploaded file's own <title> is usually
  // blank (email templates aren't written with a browser tab in mind), so
  // fill it in from the CMS fields without altering anything else in the
  // file. Silently skipped if the file has no <title> or <head> tag.
  const seoTitle = newsletter.seoTitle || newsletter.title;
  if (seoTitle) {
    html = /<title>[\s\S]*?<\/title>/i.test(html)
      ? html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seoTitle)}</title>`)
      : html.replace(/<head>/i, `<head>\n<title>${escapeHtml(seoTitle)}</title>`);
  }
  if (newsletter.seoDescription) {
    const metaTag = `<meta name="description" content="${escapeHtml(newsletter.seoDescription)}">`;
    html = /<meta\s+name=["']description["']/i.test(html)
      ? html
      : html.replace(/<head>/i, `<head>\n${metaTag}`);
  }

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
