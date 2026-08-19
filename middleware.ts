import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Define paths to protect
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // Check API route permissions
  // All POST/PUT/DELETE APIs (except login/logout) require authentication.
  // GET requests are allowed publicly so the frontend can query data.
  //
  // /api/submissions is the inverse: POST is public (site visitors submit contact/
  // catalog/newsletter/datasheet forms without logging in), but GET/PATCH/DELETE
  // (reading or managing leads in the CMS) require admin auth — those contain
  // customer PII (names, emails, phone numbers) and must never be publicly readable.
  const isSubmissionsRoute = pathname.startsWith("/api/submissions");

  const isProtectedApi =
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth/") &&
    (isSubmissionsRoute ? method !== "POST" : method !== "GET");

  // Admin page protection
  if (isAdminPath && !isLoginPage) {
    const token = request.cookies.get("token")?.value;
    const verified = token ? await verifyToken(token) : null;

    if (!verified) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // API protection
  if (isProtectedApi) {
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");
    
    const verified = token ? await verifyToken(token) : null;

    if (!verified) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Unauthorized. Admin credentials required." }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
  }

  return NextResponse.next();
}

// Config to specify matching routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
