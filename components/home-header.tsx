"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { LogOut } from "lucide-react";

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

  // Handle logout
  const handleLogout = () => {
    window.location.href = "/logout?t=" + Date.now();
  };

  // Don't render anything until we've checked
  if (isLoading) {
    return (
      <header className="border-b">
        <div className="container px-4 sm:px-6 flex h-14 sm:h-16 items-center justify-between">
          <Logo />
          {/* Show nothing while loading */}
        </div>
      </header>
    );
  }

  return (
    <header className="border-b">
      <div className="container px-4 sm:px-6 flex h-14 sm:h-16 items-center justify-between">
        <Logo />
        <div>
          {!isLoggedIn ? (
            <Button
              size="default"
              asChild
              className="rounded-full text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4">
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="rounded-full text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4">
              <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Uitloggen
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
