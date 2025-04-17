"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PressRelease {
  url: string;
  title: string;
  date: string;
  description: string;
  filename: string;
  format: string;
  uploadedAt: string;
}

export function PressReleases() {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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

    fetchPressReleases();
  }, [toast]);

  // Fallback press releases if none are found
  const fallbackPressReleases: PressRelease[] = [
    {
      url: "/api/press-kit/press-release-launch",
      title: "InterieurGPT lanceert AI-platform voor interieurontwerp",
      date: "15 maart 2023",
      description:
        "InterieurGPT introduceert een revolutionair platform dat AI gebruikt om interieurontwerp te democratiseren.",
      filename: "interieurgpt-launch-press-release.pdf",
      format: "pdf",
      uploadedAt: "2023-03-15T12:00:00Z",
    },
    {
      url: "/api/press-kit/press-release-milestone",
      title: "InterieurGPT bereikt mijlpaal van 50.000 gebruikers",
      date: "22 juni 2023",
      description:
        "Slechts drie maanden na de lancering heeft InterieurGPT meer dan 50.000 gebruikers aangetrokken.",
      filename: "interieurgpt-milestone-press-release.pdf",
      format: "pdf",
      uploadedAt: "2023-06-22T12:00:00Z",
    },
  ];

  // Use fallback if no press releases are found
  const displayPressReleases =
    pressReleases.length > 0 ? pressReleases : fallbackPressReleases;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Persberichten</h2>
        <Button
          className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
          asChild>
          <a href="/api/press-kit/all-press-releases" download>
            <Download className="mr-2 h-4 w-4" />
            Download alle persberichten
          </a>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayPressReleases.length > 0 ? (
        <div className="space-y-4">
          {displayPressReleases.map((pressRelease) => (
            <Card key={pressRelease.url}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {pressRelease.title}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{pressRelease.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {pressRelease.description}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={pressRelease.url}
                        download={pressRelease.filename}>
                        <Download className="mr-2 h-4 w-4" />
                        Download {pressRelease.format.toUpperCase()}
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-muted-foreground">Geen persberichten gevonden</p>
        </div>
      )}
    </div>
  );
}
