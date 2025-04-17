"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, RefreshCw, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ScreenshotCategory = "dashboard" | "design-process" | "before-after";

interface Screenshot {
  url: string;
  filename: string;
  category: ScreenshotCategory;
  uploadedAt: string;
}

export function ScreenshotBrowser() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] =
    useState<ScreenshotCategory>("dashboard");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Voeg deze functie toe na de useState declaraties
  useEffect(() => {
    if (screenshots.length > 0) {
      console.log(
        "Screenshots geladen:",
        screenshots.map((s) => ({
          url: s.url,
          category: s.category,
          filename: s.filename,
        }))
      );
    }
  }, [screenshots]);

  const fetchScreenshots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/press-kit/list-screenshots");

      if (!response.ok) {
        throw new Error("Kon screenshots niet ophalen");
      }

      const data = await response.json();
      setScreenshots(data.screenshots || []);
    } catch (error) {
      console.error("Error fetching screenshots:", error);
      toast({
        title: "Fout",
        description:
          "Er is een fout opgetreden bij het ophalen van de screenshots",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initiële fetch
    fetchScreenshots();
    setLastRefreshed(new Date());

    // Alleen een interval instellen als auto-refresh is ingeschakeld
    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefreshEnabled) {
      // Ververs elke 30 seconden
      intervalId = setInterval(() => {
        console.log("Auto-refreshing screenshots...");
        fetchScreenshots();
        setLastRefreshed(new Date());
      }, 30000); // 30 seconden
    }

    // Ruim het interval op wanneer de component unmount of wanneer autoRefreshEnabled verandert
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefreshEnabled]); // Afhankelijk van autoRefreshEnabled

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled((prev) => !prev);
  };

  const filteredScreenshots = screenshots.filter(
    (screenshot) => screenshot.category === activeCategory
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Screenshot Browser</h2>
            {lastRefreshed && (
              <p className="text-xs text-muted-foreground">
                Laatst ververst: {lastRefreshed.toLocaleTimeString()}
                {autoRefreshEnabled && " • Auto-refresh ingeschakeld"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoRefresh}
              className={autoRefreshEnabled ? "bg-blue-50" : ""}>
              {autoRefreshEnabled ? "Auto-refresh uit" : "Auto-refresh aan"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchScreenshots();
                setLastRefreshed(new Date());
              }}
              disabled={isLoading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Vernieuwen
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="dashboard"
          value={activeCategory}
          onValueChange={(value) =>
            setActiveCategory(value as ScreenshotCategory)
          }>
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="design-process">Ontwerpproces</TabsTrigger>
            <TabsTrigger value="before-after">Voor-Na</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory}>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-32 w-full rounded-md" />
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                  </div>
                ))}
              </div>
            ) : filteredScreenshots.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredScreenshots.map((screenshot) => (
                  <div key={screenshot.url} className="space-y-2">
                    <div className="relative group">
                      {/* Voeg een fallback en error handling toe */}
                      <div className="h-32 w-full rounded-md border bg-gray-50 flex items-center justify-center">
                        <img
                          src={screenshot.url || "/placeholder.svg"}
                          alt={screenshot.filename}
                          className="h-full w-full object-contain rounded-md"
                          onError={(e) => {
                            console.error(
                              `Failed to load image: ${screenshot.url}`
                            );
                            // Fallback naar een placeholder
                            e.currentTarget.src = `/placeholder.svg?height=128&width=256&query=Image%20not%20found`;
                            // Voeg een class toe om aan te geven dat er een fout is
                            e.currentTarget.classList.add("error-image");
                          }}
                          loading="lazy" // Lazy loading voor betere prestaties
                          crossOrigin="anonymous" // Probeer CORS-problemen op te lossen
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mr-2"
                          onClick={() => {
                            console.log("Opening preview for:", screenshot.url);
                            setPreviewUrl(screenshot.url);
                          }}>
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            console.log(
                              "Opening URL in new tab:",
                              screenshot.url
                            );
                            window.open(screenshot.url, "_blank");
                          }}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm truncate">{screenshot.filename}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(screenshot.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-md">
                <p className="text-muted-foreground">
                  Geen screenshots gevonden in deze categorie
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload screenshots via het uploadformulier hierboven
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Preview Modal */}
        {previewUrl && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewUrl(null)}>
            <div
              className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] w-full overflow-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Screenshot Preview</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewUrl(null)}>
                  ✕
                </Button>
              </div>
              <div className="relative bg-gray-100 rounded-md p-2">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full max-h-[70vh] mx-auto rounded-md"
                  onError={(e) => {
                    console.error(
                      `Failed to load preview image: ${previewUrl}`
                    );
                    e.currentTarget.src = `/placeholder.svg?height=400&width=600&query=Preview%20image%20not%20found`;
                  }}
                  crossOrigin="anonymous"
                />
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded px-2 py-1 text-xs">
                  URL:{" "}
                  {previewUrl
                    ? previewUrl.length > 30
                      ? previewUrl.substring(0, 30) + "..."
                      : previewUrl
                    : "N/A"}
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(previewUrl || "");
                    toast({
                      title: "URL gekopieerd",
                      description:
                        "De afbeeldings-URL is gekopieerd naar het klembord",
                    });
                  }}>
                  URL kopiëren
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewUrl, "_blank")}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in nieuw tabblad
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
