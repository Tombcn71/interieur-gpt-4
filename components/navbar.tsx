"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, CreditCard, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const searchParams = useSearchParams();

  // Check for success parameter and refresh session
  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true" && status === "authenticated") {
      // Refresh the session to get updated credits
      const refreshSession = async () => {
        try {
          // Get the latest user data from the database
          const response = await fetch("/api/auth/refresh-session");
          const data = await response.json();

          if (data.success && data.user) {
            // Force a hard refresh to update everything
            window.location.href = "/dashboard";
          } else {
            // Fallback to router refresh
            router.refresh();
          }
        } catch (error) {
          console.error("Failed to refresh session:", error);
          router.refresh();
        }
      };

      refreshSession();

      // Show a toast or notification that credits were added
      toast({
        title: "Payment Successful",
        description: "Your credits have been added to your account.",
        duration: 5000,
      });
    }
  }, [searchParams, status, router, toast]);

  // Don't show the navbar on the homepage
  if (pathname === "/") {
    return null;
  }

  const handleSignOut = () => {
    router.push("/api/auth/signout?callbackUrl=/");
  };

  const handleSignIn = () => {
    const callbackUrl = pathname === "/" ? "/dashboard" : pathname;
    router.push(
      `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-blue-500">
              interieurGPT
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded-md"></div>
          ) : status === "authenticated" && session ? (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden md:flex rounded-full">
                <Link href="/dashboard">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{session.user.credits} Credits</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || ""}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/credits">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Credits: {session.user.credits}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Uitloggen</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={handleSignIn} className="rounded-full">
              Inloggen
            </Button>
          )}
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
            {status === "authenticated" && session && (
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
