import { StyleGuide } from "@/components/style-guide";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Stijlgids - InterieurGPT",
  description:
    "Ontdek alle interieurstijlen die beschikbaar zijn in InterieurGPT",
};

export default function StyleGuidePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm font-medium">
                Terug naar home
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              asChild
              className="rounded-full text-xs sm:text-sm py-1 px-3 sm:py-2 sm:px-4 h-8 sm:h-10">
              <Link href="/login">Begin Herontwerp</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                Interieurstijlen Gids
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-[600px] mx-auto px-4">
                Ontdek alle interieurstijlen die je kunt gebruiken met{" "}
                <Link href="/">
                  <span className="text-blue-500">interieurGPT</span>{" "}
                </Link>{" "}
                om je ruimte te transformeren
              </p>
            </div>

            <StyleGuide />
          </div>
        </div>
      </main>
    </div>
  );
}
