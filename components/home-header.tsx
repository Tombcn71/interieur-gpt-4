"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

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
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="font-bold text-2xl text-blue-500">
              interieurGPT
            </span>
          </Link>
          {/* Show nothing while loading */}
        </div>
      </header>
    );
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-bold text-2xl text-blue-500">interieurGPT</span>
        </Link>
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
