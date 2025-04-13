import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname starts with /dashboard
  if (pathname.startsWith("/dashboard")) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      // If the user is not authenticated, redirect to the login page
      if (!token) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", encodeURI(pathname));
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Error in middleware:", error);
      // If there's an error, still allow the request to proceed
      // The page's server component can handle authentication as a fallback
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
