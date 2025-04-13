import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    // If there's no session, redirect to home
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Return a response that will clear the session cookie
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");

    return response;
  } catch (error) {
    console.error("Error in signout route:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
