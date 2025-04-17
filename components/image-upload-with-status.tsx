"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface ImageUploadWithStatusProps {
  onUpload: (url: string) => void;
  maxSizeMB?: number;
}

type UploadStatus = "idle" | "preparing" | "uploading" | "success" | "error";

export function ImageUploadWithStatus({
  onUpload,
  maxSizeMB = 5,
}: ImageUploadWithStatusProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blobConfigured, setBlobConfigured] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Check Blob configuration on mount
  useEffect(() => {
    const checkBlobConfig = async () => {
      try {
        const response = await fetch("/api/blob/check");
        const data = await response.json();
        setBlobConfigured(data.configured);

        if (!data.configured) {
          console.error("Blob configuration error:", data.error);
          setErrorMessage(
            `Vercel Blob is niet correct geconfigureerd: ${data.error}`
          );
        }
      } catch (error) {
        console.error("Error checking Blob configuration:", error);
        setBlobConfigured(false);
        setErrorMessage("Kon Vercel Blob configuratie niet controleren");
      }
    };

    checkBlobConfig();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setStatus("preparing");
    setProgress(0);
    setErrorMessage(null);

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setStatus("error");
      setErrorMessage(
        `Bestand is te groot (${fileSizeMB.toFixed(
          2
        )} MB). Maximum grootte is ${maxSizeMB} MB.`
      );
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate progress for better UX
    setStatus("uploading");
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    // Upload file
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.details || "Upload failed"
        );
      }

      const data = await response.json();
      setProgress(100);
      setStatus("success");
      onUpload(data.url);

      toast({
        title: "Upload geslaagd",
        description: "De afbeelding is succesvol geüpload.",
      });
    } catch (error) {
      clearInterval(progressInterval);
      setStatus("error");
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Er is een fout opgetreden bij het uploaden";
      setErrorMessage(errorMsg);
      console.error("Upload error:", error);

      toast({
        title: "Upload mislukt",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUpload("");
  };

  const handleRetry = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image">Foto van je kamer</Label>

      {blobConfigured === false && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuratiefout</AlertTitle>
          <AlertDescription>
            {errorMessage ||
              "Vercel Blob is niet correct geconfigureerd. Uploads zullen niet werken."}
          </AlertDescription>
        </Alert>
      )}

      {!preview ? (
        <div className="border-2 border-dashed rounded-xl p-6 text-center">
          <Input
            id="image"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={blobConfigured === false}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={status === "uploading" || blobConfigured === false}
            className="w-full h-32 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed">
            {status === "uploading" ? (
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                <span>Uploading...</span>
                <Progress value={progress} className="w-48 h-2 mt-2" />
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-blue-500" />
                <span>Klik om een foto te uploaden</span>
                <span className="text-xs text-muted-foreground">
                  Maximum bestandsgrootte: {maxSizeMB} MB
                </span>
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

          {status === "uploading" && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-xl">
              <RefreshCw className="h-8 w-8 text-white animate-spin mb-2" />
              <span className="text-white">Uploading...</span>
              <Progress
                value={progress}
                className="w-48 h-2 mt-2 bg-white/20"
              />
            </div>
          )}

          {status === "success" && (
            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
              <CheckCircle className="h-5 w-5" />
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-xl p-4">
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-white text-center mb-2">{errorMessage}</p>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={handleRemove}>
                  Verwijderen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="bg-white">
                  Opnieuw proberen
                </Button>
              </div>
            </div>
          )}

          {status !== "error" && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 rounded-full"
              onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
