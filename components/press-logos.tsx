"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LogoCategory = "dark" | "light" | "icon" | "monochrome" | "color";

interface Logo {
  url: string;
  filename: string;
  category: LogoCategory;
  format: string;
  uploadedAt: string;
}

export function PressLogos() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<LogoCategory>("dark");
  const { toast } = useToast();

  useEffect(() => {
    const fetchLogos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/press-kit/list-logos");

        if (!response.ok) {
          throw new Error("Kon logo's niet ophalen");
        }

        const data = await response.json();
        setLogos(data.logos || []);
      } catch (error) {
        console.error("Error fetching logos:", error);
        toast({
          title: "Fout",
          description:
            "Er is een fout opgetreden bij het ophalen van de logo's",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogos();
  }, [toast]);

  const filteredLogos = logos.filter(
    (logo) => logo.category === activeCategory
  );

  const downloadLogo = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading logo:", error);
      toast({
        title: "Fout",
        description:
          "Er is een fout opgetreden bij het downloaden van het logo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Logo's</h2>
        <Button
          className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
          asChild>
          <a href="/api/press-kit/logos" download>
            <Download className="mr-2 h-4 w-4" />
            Download alle logo's
          </a>
        </Button>
      </div>

      <Tabs
        defaultValue="dark"
        value={activeCategory}
        onValueChange={(value) => setActiveCategory(value as LogoCategory)}>
        <TabsList className="mb-4">
          <TabsTrigger value="dark">Donker</TabsTrigger>
          <TabsTrigger value="light">Licht</TabsTrigger>
          <TabsTrigger value="icon">Icoon</TabsTrigger>
          <TabsTrigger value="monochrome">Monochroom</TabsTrigger>
          <TabsTrigger value="color">Kleur</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory}>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredLogos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredLogos.map((logo) => (
                <Card key={logo.url} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div
                      className={`h-32 w-full rounded-md ${
                        logo.category === "light" ? "bg-gray-800" : "bg-gray-50"
                      } flex items-center justify-center p-4 mb-4`}>
                      <img
                        src={logo.url || "/placeholder.svg"}
                        alt={logo.filename}
                        className="h-full w-full object-contain rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = `/placeholder.svg?height=128&width=256&query=Logo%20not%20found`;
                        }}
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium truncate">
                        {logo.filename}.{logo.format}
                      </p>
                      <p className="text-xs text-gray-500">
                        {logo.format.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          downloadLogo(
                            logo.url,
                            `${logo.filename}.${logo.format}`
                          )
                        }>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-auto px-2"
                        onClick={() => window.open(logo.url, "_blank")}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-md">
              <p className="text-muted-foreground">
                Geen logo's gevonden in deze categorie
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
