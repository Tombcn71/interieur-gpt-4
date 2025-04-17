import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PromoBanner } from "@/components/promo-banner";
import { MediaLogos } from "@/components/media-logos";
import { HomeHeader } from "@/components/home-header";
import { ReviewsSection } from "@/components/reviews-section";
import { PricingSection } from "@/components/pricing-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />

      <main className="flex-1">
        {/* Hero Section - Improved for mobile */}
        <section className="py-12 md:py-20 lg:py-28">
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-block bg-gray-100 rounded-full px-4 py-2 text-sm">
                  Gebruikt door meer dan{" "}
                  <span className="text-blue-500 font-medium">1000 mensen</span>
                </div>

                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                  <span className="whitespace-nowrap">
                    Jouw persoonlijke <span className="text-blue-500">AI</span>
                  </span>{" "}
                  <br className="hidden sm:inline" />
                  interieurontwerper
                </h1>

                <div className="pt-2 md:pt-4 space-y-4 sm:space-y-0 sm:flex sm:gap-4">
                  <Button
                    size="lg"
                    asChild
                    className="rounded-full h-12 md:h-14 px-6 md:px-8 text-base md:text-lg w-full sm:w-auto">
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
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="rounded-full h-12 md:h-14 px-6 md:px-8 text-base md:text-lg w-full sm:w-auto border-2">
                    <Link href="/stijlgids">
                      Bekijk stijlgids
                      <svg
                        className="ml-2 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white mx-auto max-w-md lg:max-w-none w-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/hero.png"
                    alt="Modern interior design"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1 font-medium text-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <HowItWorks />
        {/* Reviews Section */}

        {/* Pricing Section */}
        <PricingSection />

        {/* Media Logos */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 sm:px-6">
            <FAQSection />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-500 text-white">
          <div className="container px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Klaar om je ruimte te transformeren?
            </h2>
            <p className="text-lg sm:text-xl mb-8 max-w-[600px] mx-auto">
              Begin vandaag nog met het herontwerpen van je interieur met onze
              AI-technologie.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="rounded-full h-12 md:h-14 px-6 md:px-8 text-base md:text-lg">
              <Link href="/login">Begin nu</Link>
            </Button>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
