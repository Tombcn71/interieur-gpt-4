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
        console.log("No token found, redirecting to login");
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", encodeURI(pathname));
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Error in middleware:", error);
      // If there's an error, redirect to login as a safety measure
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
