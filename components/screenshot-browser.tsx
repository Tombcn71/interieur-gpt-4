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
    fetchScreenshots();
  }, []);

  const filteredScreenshots = screenshots.filter(
    (screenshot) => screenshot.category === activeCategory
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Screenshot Browser</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchScreenshots}
            disabled={isLoading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Vernieuwen
          </Button>
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
                      <img
                        src={screenshot.url || "/placeholder.svg"}
                        alt={screenshot.filename}
                        className="h-32 w-full object-cover rounded-md border"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mr-2"
                          onClick={() => setPreviewUrl(screenshot.url)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => window.open(screenshot.url, "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm truncate">{screenshot.filename}</p>
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
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-[70vh] mx-auto rounded-md"
              />
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewUrl, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
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
