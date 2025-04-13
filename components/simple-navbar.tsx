"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Home, CreditCard, Zap } from "lucide-react";
import { Logo } from "@/components/logo";

export function SimpleNavbar() {
  const pathname = usePathname();

  // Don't show the navbar on the homepage
  if (pathname === "/") {
    return null;
  }

  // Direct logout function that doesn't rely on next-auth
  const handleDirectLogout = () => {
    // Redirect to the standard logout page
    window.location.href = "/logout?t=" + Date.now();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Logo />

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
