import { Navbar } from "@/components/navbar"
import { PricingSection } from "@/components/pricing-section"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Prijzen</h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              Kies het plan dat bij je past en begin met het transformeren van je ruimtes.
            </p>
          </div>
          <PricingSection />
        </div>
      </main>
    </div>
  )
}
