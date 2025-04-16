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

type ScreenshotCategory = "dashboard" | "design-process" | "before-after";

export function ScreenshotUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState<ScreenshotCategory>("dashboard");
  const [filename, setFilename] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setFilename(file.name.replace(/\.[^/.]+$/, ""));
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
      formData.append("filename", filename);

      console.log("Uploading file:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });

      // Send the file to the server
      const response = await fetch("/api/press-kit/upload-screenshot", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload mislukt");
      }

      const data = await response.json();
      console.log("Upload response:", data);

      toast({
        title: "Succes",
        description: "Screenshot is succesvol geüpload",
      });

      // Reset the form
      setPreview(null);
      setFilename("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading screenshot:", error);
      toast({
        title: "Fout",
        description:
          error instanceof Error
            ? error.message
            : "Er is een fout opgetreden bij het uploaden van de screenshot",
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
        <CardTitle>Screenshot Uploaden</CardTitle>
        <CardDescription>
          Upload screenshots voor de perskit. Deze worden beschikbaar gemaakt in
          de downloadbare perskit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categorie</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as ScreenshotCategory)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer een categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard">Dashboard</SelectItem>
              <SelectItem value="design-process">Ontwerpproces</SelectItem>
              <SelectItem value="before-after">Voor-Na Vergelijking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenshot">Screenshot</Label>
          {!preview ? (
            <div className="border-2 border-dashed rounded-xl p-6 text-center">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
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
                    <span>Klik om een screenshot te uploaden</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-64 object-contain rounded-xl"
              />
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
              placeholder="dashboard-desktop"
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
              Screenshot uploaden
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
