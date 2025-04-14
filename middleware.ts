import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, login page, and stijlgids page
  if (
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname === "/stijlgids"
  ) {
    return NextResponse.next();
  }

  // Only protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    try {
      // Get token with minimal options to avoid errors
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      // If no token, redirect to login
      if (!token) {
        // Create login URL
        const loginUrl = new URL("/login", request.url);

        // Only add callbackUrl if we're not already coming from login
        // This helps prevent redirect loops
        const referer = request.headers.get("referer") || "";
        if (!referer.includes("/login")) {
          loginUrl.searchParams.set("callbackUrl", pathname);
        }

        return NextResponse.redirect(loginUrl);
      }

      // User is authenticated, proceed
      return NextResponse.next();
    } catch (error) {
      console.error("Auth middleware error:", error);

      // On error, redirect to login with error param
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "auth");
      return NextResponse.redirect(loginUrl);
    }
  }

  // For all other routes, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images folder)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|images|public).*)",
  ],
};
