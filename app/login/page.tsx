import type { Metadata } from "next";
import { HeroSection } from "./hero-section";
import { Logo } from "@/components/logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inloggen - InterieurGPT",
  description:
    "Log in op je InterieurGPT account en herontwerp je kamer binnen seconden",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-4">
            <Link
              href="/prijzen"
              className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Prijzen
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 interieurGPT. Alle rechten voorbehouden.
            </p>
            <div className="flex gap-6">
              <Link
                href="/voorwaarden"
                className="text-sm text-gray-500 hover:text-gray-900">
                Voorwaarden
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
