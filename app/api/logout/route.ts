import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Handle both GET and POST requests
export async function GET() {
  return handleLogout();
}

export async function POST() {
  return handleLogout();
}

async function handleLogout() {
  // Create a response that redirects to the home page with a cache-busting parameter
  const timestamp = new Date().getTime();
  const response = NextResponse.redirect(
    new URL(
      `/?t=${timestamp}`,
      process.env.NEXT_PUBLIC_APP_URL || "https://www.interieurgpt.nl"
    )
  );

  // Get all cookies
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Clear all cookies, especially focusing on auth-related ones
  for (const cookie of allCookies) {
    // Delete with various path and domain combinations to ensure it's cleared
    response.cookies.delete({
      name: cookie.name,
      path: "/",
    });

    // Try with domain
    response.cookies.delete({
      name: cookie.name,
      path: "/",
      domain: ".interieurgpt.nl",
    });

    response.cookies.delete({
      name: cookie.name,
      path: "/",
      domain: "interieurgpt.nl",
    });
  }

  // Explicitly clear known NextAuth cookies with various combinations
  const nextAuthCookies = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Secure-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];

  for (const cookieName of nextAuthCookies) {
    response.cookies.delete(cookieName);

    // Try with domain
    response.cookies.delete({
      name: cookieName,
      path: "/",
      domain: ".interieurgpt.nl",
    });

    response.cookies.delete({
      name: cookieName,
      path: "/",
      domain: "interieurgpt.nl",
    });
  }

  // Set cache control headers to prevent caching
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}
