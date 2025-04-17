"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  FileText,
  Download,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

type PressReleaseCategory =
  | "launch"
  | "milestone"
  | "update"
  | "partnership"
  | "other"
  | "all";

interface PressRelease {
  title: string;
  description: string;
  releaseDate: string;
  category: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  path: string;
  uploadedAt: string;
}

export function PressReleaseBrowser() {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] =
    useState<PressReleaseCategory>("all");
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchPressReleases = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/press-kit/list-press-releases");

      if (!response.ok) {
        throw new Error("Kon persberichten niet ophalen");
      }

      const data = await response.json();
      setPressReleases(data.pressReleases || []);
    } catch (error) {
      console.error("Error fetching press releases:", error);
      toast({
        title: "Fout",
        description:
          "Er is een fout opgetreden bij het ophalen van de persberichten",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initiële fetch
    fetchPressReleases();
    setLastRefreshed(new Date());

    // Alleen een interval instellen als auto-refresh is ingeschakeld
    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefreshEnabled) {
      // Ververs elke 30 seconden
      intervalId = setInterval(() => {
        console.log("Auto-refreshing press releases...");
        fetchPressReleases();
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDateNL = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: nl });
    } catch (e) {
      return dateString;
    }
  };

  const filteredPressReleases =
    activeCategory === "all"
      ? pressReleases
      : pressReleases.filter((pr) => pr.category === activeCategory);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Persberichten Browser</h2>
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
                fetchPressReleases();
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
          defaultValue="all"
          value={activeCategory}
          onValueChange={(value) =>
            setActiveCategory(value as PressReleaseCategory)
          }>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="launch">Lancering</TabsTrigger>
            <TabsTrigger value="milestone">Mijlpaal</TabsTrigger>
            <TabsTrigger value="update">Update</TabsTrigger>
            <TabsTrigger value="partnership">Partnerschap</TabsTrigger>
            <TabsTrigger value="other">Overig</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory}>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPressReleases.length > 0 ? (
              <div className="space-y-4">
                {filteredPressReleases.map((pressRelease) => (
                  <div
                    key={pressRelease.path}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">
                        {pressRelease.title}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDateNL(pressRelease.releaseDate)}
                      </div>
                    </div>
                    {pressRelease.description && (
                      <p className="text-muted-foreground text-sm mb-4">
                        {pressRelease.description}
                      </p>
                    )}
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mr-1.5 text-blue-500" />
                        <span className="mr-2">{pressRelease.fileName}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {formatFileSize(pressRelease.fileSize)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(pressRelease.url, "_blank")
                          }
                          className="text-xs h-8">
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          Bekijken
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            // Create a temporary link element
                            const link = document.createElement("a");
                            link.href = pressRelease.url;
                            link.download = pressRelease.fileName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="text-xs h-8">
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-md">
                <p className="text-muted-foreground">
                  Geen persberichten gevonden in deze categorie
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload persberichten via het uploadformulier hierboven
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
