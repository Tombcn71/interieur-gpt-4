import type React from "react";
import { Camera, Palette, Zap, ArrowRight } from "lucide-react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function HowItWorks() {
  const steps: Step[] = [
    {
      icon: <Camera className="h-8 w-8 text-blue-500" />,
      title: "Upload een foto",
      description:
        "Maak een foto van de kamer die je wilt transformeren. Hoe duidelijker de foto, hoe beter het resultaat.",
    },
    {
      icon: <Palette className="h-8 w-8 text-blue-500" />,
      title: "Selecteer een stijl",
      description:
        "Kies uit onze uitgebreide collectie interieurstijlen, van modern tot klassiek, van industrieel tot landelijk.",
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: "Bekijk de transformatie",
      description:
        "Onze AI tovert je ruimte om in de gekozen stijl. Bewaar, vergelijk of deel je nieuwe interieurontwerp.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Hoe het werkt</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Transformeer je interieur in drie eenvoudige stappen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>

              {/* Arrow between steps (only for desktop and not for the last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-blue-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
