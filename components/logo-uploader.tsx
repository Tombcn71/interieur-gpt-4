"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LogoCategory = "dark" | "light" | "icon" | "monochrome" | "color";
type LogoFormat = "svg" | "png" | "jpg";

export function LogoUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState<LogoCategory>("dark");
  const [format, setFormat] = useState<LogoFormat>("svg");
  const [filename, setFilename] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkIfBlobIsAvailable = async (
    url: string,
    maxAttempts = 5
  ): Promise<boolean> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        console.log(
          `Checking if blob is available (attempt ${attempt + 1}): ${url}`
        );
        const response = await fetch(url, {
          method: "HEAD",
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });

        if (response.ok) {
          console.log(`Blob is available: ${url}`);
          return true;
        }

        console.log(
          `Blob not yet available (status: ${response.status}): ${url}`
        );
      } catch (e) {
        console.log(
          `Error checking blob availability (attempt ${attempt + 1}):`,
          e
        );
      }

      // Wacht 1 seconde tussen pogingen
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(
      `Blob still not available after ${maxAttempts} attempts: ${url}`
    );
    return false;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the selected file
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Set default filename based on the file
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    setFilename(baseName);

    // Detect format from file extension
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (extension === "svg") {
      setFormat("svg");
    } else if (extension === "png") {
      setFormat("png");
    } else if (["jpg", "jpeg"].includes(extension)) {
      setFormat("jpg");
    }
  };

  const handleUpload = async () => {
    if (!preview || !filename || !selectedFile) {
      toast({
        title: "Fout",
        description: "Selecteer een bestand en geef een bestandsnaam op",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create a FormData object using the stored file
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", category);
      formData.append("format", format);
      formData.append("filename", filename);

      console.log("Uploading logo:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        category,
        format,
        filename,
      });

      // Send the file to the server
      const response = await fetch("/api/press-kit/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload mislukt");
      }

      const data = await response.json();
      console.log("Upload response:", data);

      const { url, path } = data;

      // Controleer of de blob beschikbaar is
      const isAvailable = await checkIfBlobIsAvailable(url);

      if (isAvailable) {
        toast({
          title: "Succes",
          description: "Logo is succesvol geüpload en is nu beschikbaar",
        });
      } else {
        toast({
          title: "Let op",
          description:
            "Logo is geüpload maar is mogelijk nog niet direct beschikbaar. Ververs de pagina over enkele seconden.",
          variant: "default",
        });
      }

      // Reset het formulier
      setPreview(null);
      setFilename("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Fout",
        description:
          error instanceof Error
            ? error.message
            : "Er is een fout opgetreden bij het uploaden van het logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFilename("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo Uploaden</CardTitle>
        <CardDescription>
          Upload logo's voor de perskit. Deze worden beschikbaar gemaakt in de
          downloadbare perskit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categorie</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as LogoCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Donker</SelectItem>
                <SelectItem value="light">Licht</SelectItem>
                <SelectItem value="icon">Icoon</SelectItem>
                <SelectItem value="monochrome">Monochroom</SelectItem>
                <SelectItem value="color">Kleur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Formaat</Label>
            <Select
              value={format}
              onValueChange={(value) => setFormat(value as LogoFormat)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een formaat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="svg">SVG (Vector)</SelectItem>
                <SelectItem value="png">PNG (Transparant)</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          {!preview ? (
            <div className="border-2 border-dashed rounded-xl p-6 text-center">
              <Input
                id="logo"
                type="file"
                accept=".svg,.png,.jpg,.jpeg"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full h-32 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-blue-500" />
                    <span>Klik om een logo te uploaden</span>
                    <span className="text-xs text-muted-foreground">
                      SVG, PNG of JPG
                    </span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center p-4">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                onClick={handleRemove}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {preview && (
          <div className="space-y-2">
            <Label htmlFor="filename">Bestandsnaam</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="logo-dark"
            />
            <p className="text-xs text-muted-foreground">
              Geef een bestandsnaam op zonder extensie. De extensie wordt
              automatisch toegevoegd.
            </p>
          </div>
        )}

        {/* Debug info */}
        {selectedFile && (
          <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
            <p>Geselecteerd bestand: {selectedFile.name}</p>
            <p>Grootte: {Math.round(selectedFile.size / 1024)} KB</p>
            <p>Type: {selectedFile.type}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={isUploading || !preview || !selectedFile}
          className="ml-auto">
          {isUploading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Uploaden...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Logo uploaden
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
