"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Upload, X, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type PressReleaseCategory =
  | "launch"
  | "milestone"
  | "update"
  | "partnership"
  | "other";

export function PressReleaseUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState<PressReleaseCategory>("launch");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileType = file.type;
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(fileType)) {
      toast({
        title: "Ongeldig bestandsformaat",
        description: "Upload een PDF of Word document (.pdf, .doc, .docx)",
        variant: "destructive",
      });
      return;
    }

    // Store the selected file
    setSelectedFile(file);
    setFileName(file.name);

    // Set default title based on the file name if empty
    if (!title) {
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      // Convert to title case and replace hyphens and underscores with spaces
      const formattedName = nameWithoutExtension
        .replace(/[-_]/g, " ")
        .replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      setTitle(formattedName);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title || !releaseDate) {
      toast({
        title: "Ontbrekende gegevens",
        description: "Vul alle verplichte velden in en selecteer een bestand",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", category);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("releaseDate", releaseDate);

      console.log("Uploading press release:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        category,
        title,
        releaseDate,
      });

      // Send the file to the server
      const response = await fetch("/api/press-kit/upload-press-release", {
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
        description: "Persbericht is succesvol geüpload",
      });

      // Reset het formulier
      setTitle("");
      setDescription("");
      setReleaseDate(format(new Date(), "yyyy-MM-dd"));
      setSelectedFile(null);
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading press release:", error);
      toast({
        title: "Fout",
        description:
          error instanceof Error
            ? error.message
            : "Er is een fout opgetreden bij het uploaden van het persbericht",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Persbericht Uploaden</CardTitle>
        <CardDescription>
          Upload persberichten voor de perskit. Deze worden beschikbaar gemaakt
          in de downloadbare perskit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Persbericht titel"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="releaseDate">Publicatiedatum *</Label>
            <div className="relative">
              <Input
                id="releaseDate"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categorie *</Label>
          <Select
            value={category}
            onValueChange={(value) =>
              setCategory(value as PressReleaseCategory)
            }>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer een categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="launch">Lancering</SelectItem>
              <SelectItem value="milestone">Mijlpaal</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="partnership">Partnerschap</SelectItem>
              <SelectItem value="other">Overig</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Beschrijving</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Korte beschrijving van het persbericht"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pressRelease">Document (PDF of Word) *</Label>
          <div className="border-2 border-dashed rounded-xl p-6 text-center">
            <Input
              id="pressRelease"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {!selectedFile ? (
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
                    <FileText className="h-8 w-8 text-blue-500" />
                    <span>Klik om een document te uploaden</span>
                    <span className="text-xs text-muted-foreground">
                      Ondersteunde formaten: PDF, DOC, DOCX
                    </span>
                  </>
                )}
              </Button>
            ) : (
              <div className="relative flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-left">{fileName}</p>
                    <p className="text-xs text-muted-foreground text-left">
                      {Math.round(selectedFile.size / 1024)} KB •{" "}
                      {selectedFile.type}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="ml-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile || !title || !releaseDate}
          className="ml-auto">
          {isUploading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Uploaden...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Persbericht uploaden
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
