"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Logging out...");

  useEffect(() => {
    const performLogout = async () => {
      try {
        // First, try to use the NextAuth signOut function
        setStatus("Clearing session...");
        await signOut({ redirect: false });

        // Then, clear all cookies manually as a backup
        setStatus("Clearing cookies...");
        document.cookie.split(";").forEach((cookie) => {
          const [name] = cookie.trim().split("=");
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
        });

        // Call our API route to clear server-side cookies
        setStatus("Clearing server-side session...");
        await fetch("/api/logout", { method: "POST" });

        // Finally, redirect to home page with a full page reload
        setStatus("Redirecting...");
        window.location.href = "/";
      } catch (error) {
        console.error("Error during logout:", error);
        // Force redirect as a last resort
        window.location.href = "/";
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Uitloggen...</h1>
        <p className="mb-4">{status}</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}
