"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        return response.json();
      })
      .then((data) => {
        onUpload(data.url);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        alert("Er is een fout opgetreden bij het uploaden van de afbeelding.");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Clear the uploaded URL
    onUpload("");
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image">Foto van je kamer</Label>

      {!preview ? (
        <div className="border-2 border-dashed rounded-xl p-6 text-center">
          <Input
            id="image"
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
                <Upload className="h-8 w-8 text-blue-500" />
                <span>Klik om een foto te uploaden</span>
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl"
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
  );
}
