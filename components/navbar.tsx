"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  CreditCard,
  LogOut,
  Menu,
  X,
  Zap,
  User,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show the navbar on the homepage
  if (pathname === "/") {
    return null;
  }

  // Update the handleSignOut function to use a standard logout URL
  const handleSignOut = () => {
    // Navigate to the standard logout page
    window.location.href = "/logout?t=" + Date.now();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Logo />

          {/* Always visible navigation links */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}>
              <Home className="inline-block mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/nieuw"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard/nieuw"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}>
              <Zap className="inline-block mr-1 h-4 w-4" />
              Nieuw ontwerp
            </Link>
            <Link
              href="/dashboard/credits"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard/credits"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}>
              <CreditCard className="inline-block mr-1 h-4 w-4" />
              Credits
            </Link>
            <Link
              href="/stijlgids"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/stijlgids"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}>
              <BookOpen className="inline-block mr-1 h-4 w-4" />
              Stijlgids
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Always visible user dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/nieuw">
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Nieuw ontwerp</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/credits">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Credits kopen</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
                onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Uitloggen</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center"
              onClick={() => setMobileMenuOpen(false)}>
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/nieuw"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center"
              onClick={() => setMobileMenuOpen(false)}>
              <Zap className="mr-2 h-4 w-4" />
              Nieuw ontwerp
            </Link>
            <Link
              href="/dashboard/credits"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center"
              onClick={() => setMobileMenuOpen(false)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Credits
            </Link>
            <Link
              href="/stijlgids"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center"
              onClick={() => setMobileMenuOpen(false)}>
              <BookOpen className="mr-2 h-4 w-4" />
              Stijlgids
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium transition-colors hover:text-primary flex items-center text-left w-full text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Uitloggen
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
