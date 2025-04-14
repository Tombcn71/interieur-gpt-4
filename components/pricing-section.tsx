import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  credits: number;
  popular?: boolean;
}

export function PricingSection() {
  const pricingTiers: PricingTier[] = [
    {
      id: "basic",
      name: "Basis",
      price: "€4,99",
      description: "Perfect voor een kleine ruimte",
      features: [
        "5 AI-gegenereerde ontwerpen",
        "Standaard kwaliteit renders",
        "Toegang tot 7 interieurstijlen",
        "Geldig voor 30 dagen",
      ],
      credits: 5,
    },
    {
      id: "standard",
      name: "Standaard",
      price: "€9,99",
      description: "Ideaal voor meerdere kamers",
      features: [
        "15 AI-gegenereerde ontwerpen",
        "Hoge kwaliteit renders",
        "Toegang tot alle interieurstijlen",
        "Prioriteit ondersteuning",
        "Geldig voor 60 dagen",
      ],
      credits: 15,
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "€19,99",
      description: "Voor het hele huis",
      features: [
        "50 AI-gegenereerde ontwerpen",
        "Ultra hoge kwaliteit renders",
        "Toegang tot alle interieurstijlen",
        "Prioriteit ondersteuning",
        "Geldig voor 90 dagen",
        "Exporteren in hoge resolutie",
      ],
      credits: 50,
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">
            Eenvoudige prijzen
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Kies het pakket dat bij je past en begin met het transformeren van
            je ruimtes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl overflow-hidden border ${
                tier.popular
                  ? "border-blue-500 shadow-lg shadow-blue-100"
                  : "border-gray-200"
              }`}>
              {tier.popular && (
                <div className="bg-blue-500 text-white py-1.5 text-center text-sm font-medium">
                  Meest populair
                </div>
              )}

              <div className="p-5 sm:p-6">
                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-muted-foreground mb-4">{tier.description}</p>

                <div className="mb-4">
                  <span className="text-2xl sm:text-3xl font-bold">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground"> eenmalig</span>
                </div>

                <div className="mb-5 sm:mb-6">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 text-sm font-medium">
                      {tier.credits} credits
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-5 sm:mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full rounded-full ${
                    tier.popular ? "bg-blue-500 hover:bg-blue-600" : ""
                  }`}>
                  <Link href="/login">Kies {tier.name}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-12 text-center text-sm text-muted-foreground">
          <p>
            Alle prijzen zijn inclusief BTW. Gebruik code{" "}
            <span className="font-bold">BF60</span> voor 60% korting.
          </p>
        </div>
      </div>
    </section>
  );
}
