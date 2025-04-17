"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, RefreshCw, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LogoCategory = "dark" | "light" | "icon" | "monochrome" | "color";

interface Logo {
  url: string;
  filename: string;
  category: LogoCategory;
  format: string;
  uploadedAt: string;
}

export function LogoBrowser() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<LogoCategory>("dark");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  useEffect(() => {
    if (logos.length > 0) {
      console.log(
        "Logos loaded:",
        logos.map((logo) => ({
          url: logo.url,
          category: logo.category,
          filename: logo.filename,
          format: logo.format,
        }))
      );
    }
  }, [logos]);

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
        description: "Er is een fout opgetreden bij het ophalen van de logo's",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLogos();
    setLastRefreshed(new Date());

    // Only set an interval if auto-refresh is enabled
    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefreshEnabled) {
      // Refresh every 30 seconds
      intervalId = setInterval(() => {
        console.log("Auto-refreshing logos...");
        fetchLogos();
        setLastRefreshed(new Date());
      }, 30000); // 30 seconds
    }

    // Clean up the interval when the component unmounts or when autoRefreshEnabled changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefreshEnabled]); // Depends on autoRefreshEnabled

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled((prev) => !prev);
  };

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
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Logo Browser</h2>
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
                fetchLogos();
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
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-32 w-full rounded-md" />
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                  </div>
                ))}
              </div>
            ) : filteredLogos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredLogos.map((logo) => (
                  <div key={logo.url} className="space-y-2">
                    <div className="relative group">
                      {/* Add fallback and error handling */}
                      <div
                        className={`h-32 w-full rounded-md border ${
                          logo.category === "light"
                            ? "bg-gray-800"
                            : "bg-gray-50"
                        } flex items-center justify-center p-4`}>
                        <img
                          src={logo.url || "/placeholder.svg"}
                          alt={logo.filename}
                          className="h-full w-full object-contain rounded-md"
                          onError={(e) => {
                            console.error(`Failed to load image: ${logo.url}`);
                            // Fallback to a placeholder
                            e.currentTarget.src = `/placeholder.svg?height=128&width=256&query=Logo%20not%20found`;
                            // Add a class to indicate there was an error
                            e.currentTarget.classList.add("error-image");
                          }}
                          loading="lazy" // Lazy loading for better performance
                          crossOrigin="anonymous" // Try to solve CORS issues
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mr-2"
                          onClick={() => {
                            console.log("Opening preview for:", logo.url);
                            setPreviewUrl(logo.url);
                          }}>
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mr-2"
                          onClick={() => {
                            console.log("Downloading:", logo.url);
                            downloadLogo(
                              logo.url,
                              `${logo.filename}.${logo.format}`
                            );
                          }}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            console.log("Opening URL in new tab:", logo.url);
                            window.open(logo.url, "_blank");
                          }}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm truncate">
                        {logo.filename}.{logo.format}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(logo.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-md">
                <p className="text-muted-foreground">
                  Geen logo's gevonden in deze categorie
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload logo's via het uploadformulier hierboven
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
                <h3 className="text-lg font-medium">Logo Preview</h3>
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
                        "De logo URL is gekopieerd naar het klembord",
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
