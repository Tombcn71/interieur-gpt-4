import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const allCookies = (await cookieStore).getAll();

  // Create a response
  const response = NextResponse.json({ success: true });

  // Clear all cookies
  for (const cookie of allCookies) {
    response.cookies.delete(cookie.name);
  }

  // Explicitly clear known NextAuth cookies
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
  }

  // Set cache control headers
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}
