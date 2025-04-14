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
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white">
          <LogOut className="mr-2 h-4 w-4" />
          Uitloggen
        </Button>
      </div>
    </header>
  );
}
