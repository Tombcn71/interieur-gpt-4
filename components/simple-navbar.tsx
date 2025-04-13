"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Home, CreditCard, Zap } from "lucide-react";

export function SimpleNavbar() {
  const pathname = usePathname();

  // Don't show the navbar on the homepage
  if (pathname === "/") {
    return null;
  }

  // Direct logout function that doesn't rely on next-auth
  const handleDirectLogout = () => {
    // Clear cookies manually
    document.cookie =
      "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie =
      "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie =
      "next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie =
      "__Secure-next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie =
      "next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie =
      "__Secure-next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
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

          <nav className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary">
              <Home className="inline-block mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/nieuw"
              className="text-sm font-medium transition-colors hover:text-primary">
              <Zap className="inline-block mr-1 h-4 w-4" />
              Nieuw ontwerp
            </Link>
            <Link
              href="/dashboard/credits"
              className="text-sm font-medium transition-colors hover:text-primary">
              <CreditCard className="inline-block mr-1 h-4 w-4" />
              Credits
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="destructive"
            onClick={handleDirectLogout}
            className="bg-red-500 hover:bg-red-600 text-white">
            <LogOut className="mr-2 h-4 w-4" />
            Uitloggen
          </Button>
        </div>
      </div>
    </header>
  );
}
