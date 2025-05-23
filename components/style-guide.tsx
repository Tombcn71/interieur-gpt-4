"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Change the order of the styleCategories array to put "Basis Stijlen" first
const styleCategories = [
  {
    id: "basis",
    name: "Basis Stijlen",
    description: "De meest voorkomende en populaire interieurstijlen",
    styles: [
      {
        value: "modern",
        label: "Modern",
        description:
          "Strakke lijnen, neutrale kleuren en minimalistische decoratie. Moderne interieurs zijn functioneel en gebruiken materialen zoals glas, metaal en beton.",
        characteristics: [
          "Strakke lijnen",
          "Neutrale kleuren",
          "Minimalistische decoratie",
          "Functioneel",
          "Glas, metaal en beton",
        ],
      },
      {
        value: "minimalistisch",
        label: "Minimalistisch",
        description:
          "Gebaseerd op het principe 'minder is meer'. Minimalistische interieurs hebben weinig decoratie, een beperkt kleurenpalet en veel open ruimte.",
        characteristics: [
          "Minder is meer",
          "Beperkt kleurenpalet",
          "Veel open ruimte",
          "Functioneel meubilair",
          "Afwezigheid van rommel",
        ],
      },
      {
        value: "scandinavisch",
        label: "Scandinavisch",
        description:
          "Lichte, luchtige ruimtes met functioneel meubilair en subtiele accenten. Scandinavische interieurs gebruiken natuurlijke materialen en hebben een warme, gezellige uitstraling.",
        characteristics: [
          "Licht en luchtig",
          "Functioneel meubilair",
          "Natuurlijke materialen",
          "Neutrale kleuren met accenten",
          "Hygge (gezelligheid)",
        ],
      },
      {
        value: "industrieel",
        label: "Industrieel",
        description:
          "Geïnspireerd door oude fabrieken en werkplaatsen. Industriële interieurs hebben zichtbare constructie-elementen, ruwe materialen en vintage accenten.",
        characteristics: [
          "Zichtbare constructie-elementen",
          "Ruwe materialen",
          "Metaal en hout",
          "Vintage accenten",
          "Open plafonds",
        ],
      },
      {
        value: "bohemian",
        label: "Bohemian",
        description:
          "Eclectisch en vrij van regels. Bohemian interieurs combineren patronen, texturen en kleuren uit verschillende culturen en periodes.",
        characteristics: [
          "Eclectisch",
          "Veel patronen en texturen",
          "Levendige kleuren",
          "Planten",
          "Handgemaakte items",
        ],
      },
      {
        value: "landelijk",
        label: "Landelijk",
        description:
          "Warm en uitnodigend met rustieke elementen. Landelijke interieurs gebruiken natuurlijke materialen, zachte kleuren en comfortabel meubilair.",
        characteristics: [
          "Rustieke elementen",
          "Natuurlijke materialen",
          "Zachte kleuren",
          "Comfortabel meubilair",
          "Vintage accessoires",
        ],
      },
      {
        value: "klassiek",
        label: "Klassiek",
        description:
          "Tijdloos en elegant met symmetrische arrangementen. Klassieke interieurs hebben verfijnde details, rijke materialen en traditionele meubels.",
        characteristics: [
          "Symmetrie",
          "Verfijnde details",
          "Rijke materialen",
          "Traditionele meubels",
          "Elegante accessoires",
        ],
      },
    ],
  },
  {
    id: "trends",
    name: "Moderne Trends",
    description: "De nieuwste trends in interieurontwerp",
    styles: [
      {
        value: "grandmillennial",
        label: "Grandmillennial",
        description:
          "Een moderne interpretatie van traditionele stijlen. Grandmillennial interieurs combineren vintage elementen met hedendaagse stukken.",
        characteristics: [
          "Vintage elementen",
          "Hedendaagse stukken",
          "Bloemenprints",
          "Franjes en kwastjes",
          "Chinoiserie",
        ],
      },

      {
        value: "cottagecore",
        label: "Cottagecore",
        description:
          "Romantisch en nostalgisch, geïnspireerd door het plattelandsleven. Cottagecore interieurs hebben bloemenprints, vintage items en een gezellige sfeer.",
        characteristics: [
          "Bloemenprints",
          "Vintage items",
          "Gezellige sfeer",
          "Handgemaakte decoratie",
          "Natuurlijke elementen",
        ],
      },
      {
        value: "wabi-sabi",
        label: "Wabi-Sabi",
        description:
          "Gebaseerd op het Japanse concept van het omarmen van imperfectie. Wabi-sabi interieurs hebben imperfecte, natuurlijke elementen en een rustige sfeer.",
        characteristics: [
          "Imperfecte elementen",
          "Natuurlijke materialen",
          "Rustige sfeer",
          "Eenvoud",
          "Handgemaakte items",
        ],
      },
      {
        value: "industrial-chic",
        label: "Industrial Chic",
        description:
          "Een verfijnde versie van de industriële stijl. Industrial chic interieurs combineren ruwe industriële elementen met luxe details.",
        characteristics: [
          "Industriële elementen",
          "Luxe details",
          "Contrast in texturen",
          "Metaal en hout",
          "Statement verlichting",
        ],
      },
    ],
  },
  {
    id: "hedendaags",
    name: "Hedendaagse Stijlen",
    description:
      "Moderne interpretaties van klassieke stijlen en nieuwe trends",
    styles: [
      {
        value: "mid-century-modern",
        label: "Mid-Century Modern",
        description:
          "Populair in de jaren '50 en '60, gekenmerkt door organische vormen, minimalisme en functionaliteit. Mid-century modern interieurs hebben een retro uitstraling met een moderne twist.",
        characteristics: [
          "Organische vormen",
          "Functioneel design",
          "Retro uitstraling",
          "Hout en andere natuurlijke materialen",
          "Gedurfde kleuren als accenten",
        ],
      },
      {
        value: "art-deco",
        label: "Art Deco",
        description:
          "Luxueus en dramatisch met geometrische patronen. Art deco interieurs hebben rijke kleuren, glanzende oppervlakken en opvallende contrasten.",
        characteristics: [
          "Geometrische patronen",
          "Rijke kleuren",
          "Glanzende oppervlakken",
          "Opvallende contrasten",
          "Luxe materialen",
        ],
      },
      {
        value: "japandi1",
        label: "Japandi",
        description:
          "Een fusie van Japans en Scandinavisch design. Japandi interieurs zijn minimalistisch maar warm, met natuurlijke materialen en functionele eenvoud.",
        characteristics: [
          "Minimalisme",
          "Natuurlijke materialen",
          "Functionele eenvoud",
          "Neutrale kleuren",
          "Handgemaakte items",
        ],
      },
      {
        value: "kust",
        label: "Kust/Strand",
        description:
          "Licht en luchtig met een ontspannen sfeer. Kustinterieurs gebruiken natuurlijke texturen, zachte blauwe en neutrale tinten, en maritieme accenten.",
        characteristics: [
          "Licht en luchtig",
          "Natuurlijke texturen",
          "Blauwe en neutrale tinten",
          "Maritieme accenten",
          "Ontspannen sfeer",
        ],
      },
    ],
  },
  {
    id: "cultureel",
    name: "Culturele Stijlen",
    description:
      "Interieurstijlen geïnspireerd door verschillende culturen en regio's",
    styles: [
      {
        value: "mediterraans",
        label: "Mediterraans",
        description:
          "Warm en uitnodigend, geïnspireerd door landen rond de Middellandse Zee. Mediterrane interieurs hebben aardetinten, terracotta, en handgemaakte tegels.",
        characteristics: [
          "Aardetinten",
          "Terracotta",
          "Handgemaakte tegels",
          "Texturen",
          "Boogvormige doorgangen",
        ],
      },
      {
        value: "marokkaans",
        label: "Marokkaans",
        description:
          "Rijk aan kleur en patroon met exotische invloeden. Marokkaanse interieurs hebben kleurrijke tegels, metalen lantaarns en weelderige textiel.",
        characteristics: [
          "Kleurrijke tegels",
          "Metalen lantaarns",
          "Weelderige textiel",
          "Geometrische patronen",
          "Rijke kleuren",
        ],
      },
      {
        value: "tropisch",
        label: "Tropisch",
        description:
          "Fris en levendig met natuurlijke elementen. Tropische interieurs hebben veel planten, natuurlijke materialen en heldere accenten.",
        characteristics: [
          "Veel planten",
          "Natuurlijke materialen",
          "Heldere accenten",
          "Rotan en bamboe",
          "Botanische prints",
        ],
      },
      {
        value: "rustiek-italiaans",
        label: "Rustiek Italiaans",
        description:
          "Warm en uitnodigend met een landelijke charme. Rustiek Italiaanse interieurs hebben verweerde oppervlakken, natuursteen en handgemaakte items.",
        characteristics: [
          "Verweerde oppervlakken",
          "Natuursteen",
          "Handgemaakte items",
          "Warme kleuren",
          "Houten balken",
        ],
      },
    ],
  },
  {
    id: "gespecialiseerd",
    name: "Gespecialiseerde Stijlen",
    description: "Unieke en specifieke benaderingen van interieurontwerp",
    styles: [
      {
        value: "maximalistisch",
        label: "Maximalistisch",
        description:
          "Gedurfd en expressief met een 'meer is meer' filosofie. Maximalistische interieurs hebben veel patronen, texturen en persoonlijke items.",
        characteristics: [
          "Meer is meer",
          "Veel patronen en texturen",
          "Gedurfde kleuren",
          "Persoonlijke items",
          "Kunstwerken",
        ],
      },
      {
        value: "eclectisch",
        label: "Eclectisch",
        description:
          "Een mix van verschillende stijlen en periodes. Eclectische interieurs zijn persoonlijk en uniek, met items die een verhaal vertellen.",
        characteristics: [
          "Mix van stijlen",
          "Persoonlijk en uniek",
          "Items met een verhaal",
          "Onverwachte combinaties",
          "Creatieve expressie",
        ],
      },
      {
        value: "vintage",
        label: "Vintage",
        description:
          "Nostalgisch met items uit het verleden. Vintage interieurs hebben antieke meubels, retro accessoires en een gevoel van geschiedenis.",
        characteristics: [
          "Antieke meubels",
          "Retro accessoires",
          "Gevoel van geschiedenis",
          "Patina en verwering",
          "Unieke vondsten",
        ],
      },
      {
        value: "biofiel",
        label: "Biofiel",
        description:
          "Gericht op het verbinden van mensen met de natuur. Biofiele interieurs hebben veel planten, natuurlijk licht en organische materialen.",
        characteristics: [
          "Veel planten",
          "Natuurlijk licht",
          "Organische materialen",
          "Natuurlijke kleuren",
          "Duurzame items",
        ],
      },
    ],
  },
];

// Wijzig de TabsCloud component om de actieve tab te markeren en alleen op mobiel te tonen
function TabsCloud({
  onSelectCategory,
  activeTab,
}: {
  onSelectCategory: (categoryId: string) => void;
  activeTab: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8 md:hidden">
      {styleCategories.map((category) => (
        <div
          key={category.id}
          className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-colors ${
            activeTab === category.id
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => onSelectCategory(category.id)}>
          {category.name}
        </div>
      ))}
    </div>
  );
}

// StyleImage component to handle image errors properly
function StyleImage({ style, category }: { style: any; category: any }) {
  const [imgSrc, setImgSrc] = useState(
    `/images/styles/${category.id}/${style.value}.jpg`
  );
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  // Handle image error
  const handleImageError = () => {
    setImgSrc(
      `/placeholder.svg?height=400&width=600&query=${style.label} ${category.name} interior design style`
    );
    setIsPlaceholder(true);
  };

  return (
    <div className="aspect-video bg-muted relative">
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={`${style.label} interieurstijl voorbeeld`}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
      {isPlaceholder && (
        <div className="placeholder-indicator absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          Placeholder
        </div>
      )}
    </div>
  );
}

export function StyleGuide() {
  const [activeTab, setActiveTab] = useState("basis");
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Wijzig de handleSelectCategory functie om het scrollen te verwijderen
  const handleSelectCategory = (categoryId: string) => {
    setActiveTab(categoryId);
    // Verwijder de setTimeout en scrollIntoView code
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="mb-6 hidden md:block">
        <div className="overflow-x-auto pb-2">
          <TabsList className="flex border rounded-lg">
            {styleCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-3 py-2 text-sm whitespace-nowrap">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      {/* TabsCloud component */}
      <TabsCloud
        onSelectCategory={handleSelectCategory}
        activeTab={activeTab}
      />

      {styleCategories.map((category) => (
        <TabsContent
          key={category.id}
          value={category.id}
          className="space-y-8">
          <div
            className="text-center mb-6"
            ref={(el) => {
              categoryRefs.current[category.id] = el;
            }}>
            <h2 className="text-xl font-bold mb-2">{category.name}</h2>
            <p className="text-sm text-muted-foreground px-4">
              {category.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.styles.map((style) => (
              <Card
                key={style.value}
                id={`style-${style.value}`}
                className="overflow-hidden">
                <StyleImage style={style} category={category} />
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{style.label}</CardTitle>
                  <CardDescription className="text-xs">
                    {style.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <h4 className="font-medium mb-2 text-sm">Kenmerken:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {style.characteristics.map((characteristic, index) => (
                      <li key={index} className="text-xs">
                        {characteristic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
