"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // First try to use NextAuth's signOut
        await signOut({ redirect: false });

        // Then call our API to clear cookies
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        // Redirect to home page
        window.location.href = "/";
      } catch (error) {
        console.error("Error during logout:", error);
        // Force redirect as a last resort
        window.location.href = "/";
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}
