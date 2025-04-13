"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function HomeHeader() {
  // Use client-side session check
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [forceLogout, setForceLogout] = useState(false);

  // This ensures we only render the correct button after hydration
  useEffect(() => {
    setIsClient(true);

    // Check for stale session by making a direct API call
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session?update=true", {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          // If we get an error, assume we're not authenticated
          setForceLogout(true);
          return;
        }

        const data = await response.json();

        // If the API says we're not authenticated but our local state says we are,
        // force a logout to clear any stale state
        if (!data.user && status === "authenticated") {
          setForceLogout(true);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, [status]);

  // Force logout if needed
  useEffect(() => {
    if (forceLogout) {
      // Clear all cookies manually
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.trim().split("=");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
      });

      // Force reload the page to clear any stale state
      window.location.href = "/";
    }
  }, [forceLogout]);

  // Only show login button if we're on the client and not authenticated
  const showLoginButton =
    isClient && (status !== "authenticated" || forceLogout);
  const showDashboardButton =
    isClient && status === "authenticated" && !forceLogout;

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-blue-500">interieurGPT</span>
        </Link>
        {showLoginButton && (
          <Button asChild className="rounded-full">
            <Link href="/login">Login</Link>
          </Button>
        )}
        {showDashboardButton && (
          <Button asChild className="rounded-full">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
