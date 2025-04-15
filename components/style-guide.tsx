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
        value: "japandi",
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

export function StyleGuide() {
  return (
    <Tabs defaultValue="basis" className="w-full">
      <TabsList className="w-full grid grid-cols-2 gap-1 p-1 sm:flex sm:flex-wrap sm:justify-center sm:gap-1 mb-4 sm:mb-8 border rounded-lg overflow-visible">
        {styleCategories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="py-1.5 px-1 rounded-md text-xs font-medium whitespace-normal h-auto flex items-center justify-center text-center">
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {styleCategories.map((category) => (
        <TabsContent
          key={category.id}
          value={category.id}
          className="space-y-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {category.name}
            </h2>
            <p className="text-sm text-muted-foreground px-4">
              {category.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {category.styles.map((style) => (
              <Card key={style.value} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <p className="text-xs sm:text-sm">
                      Voorbeeldafbeelding van {style.label} stijl
                    </p>
                  </div>
                </div>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">
                    {style.label}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {style.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <h4 className="font-medium mb-2 text-sm sm:text-base">
                    Kenmerken:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {style.characteristics.map((characteristic, index) => (
                      <li key={index} className="text-xs sm:text-sm">
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
