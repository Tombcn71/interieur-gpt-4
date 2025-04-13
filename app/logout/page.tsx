"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut({ redirect: false });
        router.push("/");
      } catch (error) {
        console.error("Error during logout:", error);
        // Fallback to direct navigation
        window.location.href = "/";
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Uitloggen...</h1>
        <p>Je wordt uitgelogd en doorgestuurd naar de homepage.</p>
      </div>
    </div>
  );
}
