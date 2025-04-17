"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ExternalLink, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ScreenshotCategory = "dashboard" | "design-process" | "before-after";

interface Screenshot {
  url: string;
  filename: string;
  category: ScreenshotCategory;
  uploadedAt: string;
}

export function PressScreenshots() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] =
    useState<ScreenshotCategory>("dashboard");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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

    fetchScreenshots();
  }, [toast]);

  const filteredScreenshots = screenshots.filter(
    (screenshot) => screenshot.category === activeCategory
  );

  const downloadScreenshot = async (url: string, filename: string) => {
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
      console.error("Error downloading screenshot:", error);
      toast({
        title: "Fout",
        description:
          "Er is een fout opgetreden bij het downloaden van de screenshot",
        variant: "destructive",
      });
    }
  };

  // Helper function to get a friendly name for the category
  const getCategoryName = (category: ScreenshotCategory): string => {
    switch (category) {
      case "dashboard":
        return "Dashboard";
      case "design-process":
        return "Ontwerpproces";
      case "before-after":
        return "Voor-Na Vergelijking";
      default:
        return category;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Screenshots</h2>
        <Button
          className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
          asChild>
          <a href="/api/press-kit/screenshots" download>
            <Download className="mr-2 h-4 w-4" />
            Download alle screenshots
          </a>
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredScreenshots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScreenshots.map((screenshot) => (
                <Card key={screenshot.url} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="relative aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                      <img
                        src={screenshot.url || "/placeholder.svg"}
                        alt={screenshot.filename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `/placeholder.svg?height=200&width=300&query=Screenshot%20not%20found`;
                        }}
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium truncate">
                        {screenshot.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getCategoryName(screenshot.category)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          downloadScreenshot(
                            screenshot.url,
                            screenshot.filename
                          )
                        }>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-auto px-2"
                        onClick={() => setPreviewUrl(screenshot.url)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-auto px-2"
                        onClick={() => window.open(screenshot.url, "_blank")}>
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
                Geen screenshots gevonden in deze categorie
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
                  e.currentTarget.src = `/placeholder.svg?height=400&width=600&query=Preview%20image%20not%20found`;
                }}
                crossOrigin="anonymous"
              />
            </div>
            <div className="mt-4 flex justify-end">
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
    </div>
  );
}
