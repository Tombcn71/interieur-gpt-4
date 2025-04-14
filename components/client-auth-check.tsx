"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ClientAuthCheck({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to check authentication");
        }

        const data = await response.json();

        if (!data.authenticated) {
          router.push("/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/login?error=auth");
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-xl font-bold">Loading...</h1>
          <p className="text-muted-foreground">
            Please wait while we check your session.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
