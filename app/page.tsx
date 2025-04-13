import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PromoBanner } from "@/components/promo-banner";
import { MediaLogos } from "@/components/media-logos";
import { HomeHeader } from "@/components/home-header";
import { ReviewsSection } from "@/components/reviews-section";
import { PricingSection } from "@/components/pricing-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <PromoBanner />

      <HomeHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-block bg-gray-100 rounded-full px-4 py-2 text-sm">
                  Gebruikt door meer dan{" "}
                  <span className="text-blue-500 font-medium">1000 mensen</span>{" "}
                  om huizen te herontwerpen
                </div>

                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Jouw persoonlijke <span className="text-blue-500">AI</span>{" "}
                  <br />
                  interieurontwerper
                </h1>

                <div className="pt-4">
                  <Button
                    size="lg"
                    asChild
                    className="rounded-full h-14 px-8 text-lg">
                    <Link href="/login">
                      Herontwerp je kamer
                      <svg
                        className="ml-2 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/hero-interior.jpg"
                    alt="Modern interior design"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1 font-medium text-sm">
                    AI-gegenereerd interieur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Hoe het werkt
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-medium mb-2">Upload je foto</h3>
                <p className="text-muted-foreground">
                  Upload een foto van je huidige kamer die je wilt
                  transformeren.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-medium mb-2">Kies je stijl</h3>
                <p className="text-muted-foreground">
                  Selecteer het kamertype en de interieurstijl die je wilt voor
                  je nieuwe ruimte.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-medium mb-2">Ontvang je ontwerp</h3>
                <p className="text-muted-foreground">
                  Onze AI genereert een prachtig nieuw interieurontwerp voor je
                  kamer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* Reviews Section */}
        <ReviewsSection />

        {/* Media Logos */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <MediaLogos />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-500 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Klaar om je ruimte te transformeren?
            </h2>
            <p className="text-xl mb-8 max-w-[600px] mx-auto">
              Begin vandaag nog met het herontwerpen van je interieur met onze
              AI-technologie.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="rounded-full h-14 px-8 text-lg">
              <Link href="/login">Begin nu</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © 2023 InterieurGPT. Alle rechten voorbehouden.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground">
              Privacybeleid
            </Link>
            <Link
              href="/voorwaarden"
              className="text-sm text-muted-foreground hover:text-foreground">
              Gebruiksvoorwaarden
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
