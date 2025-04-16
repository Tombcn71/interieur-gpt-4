"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function HeroSection() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Users count pill */}
      <div className="mb-12 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-3 shadow-sm">
        <p className="text-gray-800 text-sm sm:text-base">
          Al <span className="text-blue-500 font-bold">10.000+ gebruikers</span>{" "}
          hebben interieurGPT gebruikt
        </p>
      </div>

      {/* Main headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 tracking-tight">
        Herontwerp{" "}
        <span className="text-blue-500 inline-block">je interieur</span>
        <br />
        binnen een paar seconden
      </h1>

      {/* Subheadline */}
      <p className="text-lg sm:text-xl text-gray-700 text-center max-w-2xl mb-10">
        Log in met Google om een gratis account aan te maken en begin vandaag
        nog kamers te herontwerpen. Je krijgt{" "}
        <span className="font-bold">1 herontwerp</span> gratis.
      </p>

      {/* Sign in button */}
      <Button
        onClick={handleGoogleSignIn}
        size="lg"
        className="rounded-full px-8 py-6 h-auto text-base sm:text-lg shadow-lg">
        <svg
          className="mr-2 h-5 w-5"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512">
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
        </svg>
        Inloggen met Google
      </Button>
    </div>
  );
}
