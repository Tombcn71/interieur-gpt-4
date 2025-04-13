"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

export default function LogoutPage() {
  const [status, setStatus] = useState("Logging out...");

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clear all cookies manually
        setStatus("Clearing session...");
        document.cookie.split(";").forEach((cookie) => {
          const [name] = cookie.trim().split("=");
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=${window.location.hostname}`;
        });

        // Call our API route to clear server-side cookies
        await fetch("/api/logout", {
          method: "POST",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        // Wait a moment to ensure cookies are cleared
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Finally, redirect to home page with a full page reload
        setStatus("Redirecting...");
        window.location.href = "/?t=" + Date.now(); // Add timestamp to prevent caching
      } catch (error) {
        console.error("Error during logout:", error);
        // Force redirect as a last resort
        window.location.href = "/";
      }
    };

    performLogout();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold mb-4">Uitloggen...</h1>
        <p className="mb-4">{status}</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}
