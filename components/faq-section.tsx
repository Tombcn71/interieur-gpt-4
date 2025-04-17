"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { HelpCircle, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";

// FAQ data in het Nederlands
const faqItems = [
  {
    question: "Hoe werkt InterieurGPT?",
    answer:
      "InterieurGPT gebruikt geavanceerde AI-technologie om je bestaande kamer te transformeren naar een nieuwe interieurstijl. Upload simpelweg een foto van je kamer, kies een stijl die je aanspreekt, en onze AI genereert een nieuw ontwerp dat je huidige ruimte transformeert terwijl de structuur en afmetingen behouden blijven.",
    icon: "upload",
  },
  {
    question: "Hoeveel credits heb ik nodig per ontwerp?",
    answer:
      "Voor elk nieuw ontwerp dat je genereert, wordt 1 credit in rekening gebracht. Je kunt credits kopen in verschillende pakketten: Basis (30 credits), Standaard (100 credits) en Premium (200 credits). Hoe meer credits je in één keer koopt, hoe voordeliger het wordt per ontwerp.",
    icon: "credit",
  },
  {
    question: "Kan ik mijn ontwerpen downloaden en delen?",
    answer:
      "Ja, alle gegenereerde ontwerpen kunnen worden gedownload in hoge kwaliteit. Je kunt ze ook direct delen via sociale media of opslaan voor toekomstig gebruik. De ontwerpen blijven beschikbaar in je dashboard zolang je account actief is.",
    icon: "download",
  },
  {
    question: "Welke soorten kamers kan ik herontwerpen?",
    answer:
      "Je kunt vrijwel elke ruimte in je huis herontwerpen, waaronder woonkamers, slaapkamers, keukens, badkamers, eetkamers, kantoren en kinderkamers. Onze AI is getraind op een breed scala aan interieurruimtes en kan zich aanpassen aan verschillende kamertypen.",
    icon: "room",
  },
  {
    question: "Hoe lang duurt het om een ontwerp te genereren?",
    answer:
      "Het genereren van een nieuw ontwerp duurt meestal tussen de 20-30 seconden, afhankelijk van de complexiteit van de ruimte en de gekozen stijl. Zodra het ontwerp klaar is, wordt het direct weergegeven en toegevoegd aan je dashboard.",
    icon: "time",
  },
  {
    question: "Wat voor soort foto's moet ik uploaden?",
    answer:
      "Voor de beste resultaten raden we aan om foto's te uploaden die: goed belicht zijn, de hele kamer tonen, genomen zijn vanuit een hoek die de ruimte goed weergeeft, en minimaal 1024x768 pixels groot zijn. Vermijd foto's met veel mensen, huisdieren of beweging voor optimale resultaten.",
    icon: "photo",
  },
];

// Iconen voor de FAQ items
const getIcon = (iconType: string) => {
  switch (iconType) {
    case "upload":
      return (
        <svg
          className="h-6 w-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      );
    case "credit":
      return (
        <svg
          className="h-6 w-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      );
    case "download":
      return (
        <svg
          className="h-6 w-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      );
    case "room":
      return (
        <svg
          className="h-6 w-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      );
    case "time":
      return (
        <svg
          className="h-6 w-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case "photo":
      return (
        <svg
          className="h-6 w-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    default:
      return <HelpCircle className="h-6 w-6 text-blue-500" />;
  }
};

export function FAQSection() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    setOpenItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Veelgestelde vragen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alles wat je moet weten over InterieurGPT en hoe het werkt
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4 mb-10">
              {faqItems.map((item, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={
                      openItems.includes(`item-${index}`) ? `item-${index}` : ""
                    }>
                    <AccordionItem
                      value={`item-${index}`}
                      className="border-none">
                      <div className="flex items-start p-6 gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(item.icon)}
                        </div>
                        <div className="flex-grow">
                          <AccordionTrigger
                            onClick={() => toggleItem(`item-${index}`)}
                            className="hover:no-underline text-left font-medium text-lg py-0 [&[data-state=open]>svg]:rotate-180">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="pt-4 pb-2 text-muted-foreground">
                            <p>{item.answer}</p>
                          </AccordionContent>
                        </div>
                      </div>
                    </AccordionItem>
                  </Accordion>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-white p-4 rounded-xl shadow-sm border">
              <MessageCircle className="h-5 w-5 text-blue-500" />
              <span>Heb je een andere vraag?</span>
              <Link
                href="/contact"
                className="text-blue-600 font-medium hover:underline flex items-center">
                Stuur ons een bericht
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
