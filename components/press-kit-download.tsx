"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileArchive, Check } from "lucide-react";

export function PressKitDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Initiate download
      const response = await fetch("/api/press-kit/download");

      if (!response.ok) {
        throw new Error("Download failed");
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "interieurgpt-perskit.zip";

      // Append the link to the body
      document.body.appendChild(link);

      // Click the link to start the download
      link.click();

      // Remove the link
      document.body.removeChild(link);

      // Release the URL
      window.URL.revokeObjectURL(url);

      // Show success state
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    } catch (error) {
      console.error("Error downloading press kit:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-md">
      <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">
            Complete Perskit Downloaden
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Download onze volledige perskit met alle logo's, afbeeldingen,
            persberichten en bedrijfsinformatie in één ZIP-bestand.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            onClick={handleDownload}
            disabled={isDownloading || isDownloaded}
            className="h-14 px-6 rounded-full shadow-sm text-base">
            {isDownloading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Downloaden...
              </>
            ) : isDownloaded ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Gedownload!
              </>
            ) : (
              <>
                <FileArchive className="mr-2 h-5 w-5" />
                Download Perskit (ZIP)
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
