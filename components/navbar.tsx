"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";

export function Navbar() {
  // Direct logout function that doesn't rely on next-auth
  const handleLogout = () => {
    // Redirect to the standard logout page
    window.location.href = "/logout?t=" + Date.now();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <Logo />
        <Button
          onClick={handleLogout}
          className="flex items-center rounded-full text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4">
          <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span>Uitloggen</span>
        </Button>
      </div>
    </header>
  );
}
