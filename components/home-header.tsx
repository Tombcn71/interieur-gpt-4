"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

export function HomeHeader() {
  // Don't use useSession at all - check cookies directly
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to check if any auth cookies exist
    const checkAuthCookies = () => {
      const cookies = document.cookie.split(";");
      const authCookieExists = cookies.some((cookie) => {
        const trimmedCookie = cookie.trim();
        return (
          trimmedCookie.startsWith("next-auth.session-token=") ||
          trimmedCookie.startsWith("__Secure-next-auth.session-token=")
        );
      });

      setIsLoggedIn(authCookieExists);
      setIsLoading(false);
    };

    // Check immediately
    checkAuthCookies();

    // Also set up an interval to check periodically
    const interval = setInterval(checkAuthCookies, 1000);

    // Clean up interval
    return () => clearInterval(interval);
  }, []);

  // Don't render anything until we've checked
  if (isLoading) {
    return (
      <header className="border-b">
        <div className="container px-4 sm:px-6 flex h-16 items-center justify-between">
          <Logo />
          {/* Show nothing while loading */}
        </div>
      </header>
    );
  }

  return (
    <header className="border-b">
      <div className="container px-4 sm:px-6 flex h-16 items-center justify-between">
        <Logo />
        {!isLoggedIn ? (
          <Button asChild className="rounded-full">
            <Link href="/login">Login</Link>
          </Button>
        ) : (
          <Button asChild className="rounded-full">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
