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
  // Create a response that redirects to the home page
  const response = NextResponse.redirect(
    new URL("https://www.interieurgpt.nl")
  );

  // Get all cookies
  const cookieStore = cookies();
  const allCookies = (await cookieStore).getAll();

  // Clear all cookies, especially focusing on auth-related ones
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

  return response;
}
