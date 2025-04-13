"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function HomeHeader() {
  // Use client-side session check instead of server props
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  // This ensures we only render the correct button after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only show login button if we're on the client and not authenticated
  const showLoginButton = isClient && status !== "authenticated";
  const showDashboardButton = isClient && status === "authenticated";

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-blue-500">interieurGPT</span>
        </Link>
        {showLoginButton && (
          <Button asChild className="rounded-full">
            <Link href="/login">Login</Link>
          </Button>
        )}
        {showDashboardButton && (
          <Button asChild className="rounded-full">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
