import { NextResponse } from "next/server";

export async function GET() {
  // Create a response that redirects to the home page
  const response = NextResponse.redirect(
    new URL(
      "/",
      process.env.NEXT_PUBLIC_APP_URL || "https://www.interieurgpt.nl"
    )
  );

  // Clear all auth-related cookies
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");
  response.cookies.delete("next-auth.csrf-token");
  response.cookies.delete("__Secure-next-auth.csrf-token");
  response.cookies.delete("next-auth.callback-url");
  response.cookies.delete("__Secure-next-auth.callback-url");

  return response;
}
