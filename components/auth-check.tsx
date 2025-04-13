import type React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function AuthCheck({ children }: { children: React.ReactNode }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return redirect("/login");
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Error in AuthCheck:", error);
    // If there's an error checking the session, show a fallback UI
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Session Error</h1>
          <p className="text-muted-foreground">
            There was an error checking your session.
          </p>
          <a
            href="/login"
            className="mt-4 inline-block text-blue-500 hover:underline">
            Go to login
          </a>
        </div>
      </div>
    );
  }
}
