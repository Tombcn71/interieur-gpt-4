"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Stijlen georganiseerd in categorieën
const styleCategories = [
  {
    name: "Basis Stijlen",
    styles: [
      { value: "modern", label: "Modern" },
      { value: "minimalistisch", label: "Minimalistisch" },
      { value: "scandinavisch", label: "Scandinavisch" },
      { value: "industrieel", label: "Industrieel" },
      { value: "bohemian", label: "Bohemian" },
      { value: "landelijk", label: "Landelijk" },
      { value: "klassiek", label: "Klassiek" },
    ],
  },
  {
    name: "Hedendaagse Stijlen",
    styles: [
      { value: "mid-century-modern", label: "Mid-Century Modern" },
      { value: "art-deco", label: "Art Deco" },
      { value: "japandi", label: "Japandi" },
      { value: "kust", label: "Kust/Strand" },
    ],
  },
  {
    name: "Culturele Stijlen",
    styles: [
      { value: "mediterraans", label: "Mediterraans" },
      { value: "marokkaans", label: "Marokkaans" },
      { value: "tropisch", label: "Tropisch" },
      { value: "rustiek-italiaans", label: "Rustiek Italiaans" },
    ],
  },
  {
    name: "Gespecialiseerde Stijlen",
    styles: [
      { value: "maximalistisch", label: "Maximalistisch" },
      { value: "eclectisch", label: "Eclectisch" },
      { value: "vintage", label: "Vintage" },
      { value: "biofiel", label: "Biofiel" },
    ],
  },
  {
    name: "Moderne Trends",
    styles: [
      { value: "grandmillennial", label: "Grandmillennial" },
      { value: "wabi-sabi", label: "Wabi-Sabi" },
      { value: "cottagecore", label: "Cottagecore" },
      { value: "industrial-chic", label: "Industrial Chic" },
    ],
  },
];

interface StyleSelectorProps {
  onChange: (value: string) => void;
}

export function StyleSelector({ onChange }: StyleSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Basis Stijlen",
  ]);
  const [selectedStyle, setSelectedStyle] = useState("modern");

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleStyleChange = (value: string) => {
    setSelectedStyle(value);
    onChange(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Stijl</h3>

      {styleCategories.map((category) => (
        <div key={category.name} className="space-y-2">
          <div
            className="flex items-center justify-between cursor-pointer p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
            onClick={() => toggleCategory(category.name)}>
            <Label className="cursor-pointer font-medium">
              {category.name}
            </Label>
            {expandedCategories.includes(category.name) ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>

          {expandedCategories.includes(category.name) && (
            <Tabs
              defaultValue={selectedStyle}
              value={selectedStyle}
              onValueChange={handleStyleChange}
              className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto">
                {category.styles.map((style) => (
                  <TabsTrigger
                    key={style.value}
                    value={style.value}
                    className="py-2 rounded-lg">
                    {style.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>
      ))}
    </div>
  );
}
