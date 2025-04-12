"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RoomTypeSelector } from "@/components/room-type-selector"
import { StyleSelector } from "@/components/style-selector"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/hooks/use-toast"
import { Zap } from "lucide-react"

interface NewDesignFormProps {
  credits: number
}

export function NewDesignForm({ credits }: NewDesignFormProps) {
  const [roomType, setRoomType] = useState("woonkamer")
  const [style, setStyle] = useState("modern")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = () => {
    if (!imageUrl) {
      toast({
        title: "Fout",
        description: "Upload eerst een afbeelding",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Use a regular promise pattern instead of async/await
    fetch("/api/design", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomType,
        style,
        imageUrl,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          throw new Error(data.error || "Er is een fout opgetreden")
        }

        toast({
          title: "Succes!",
          description: "Je ontwerp is succesvol gemaakt",
        })

        router.push("/dashboard")
        router.refresh()
      })
      .catch((error) => {
        console.error("Error creating design:", error)
        toast({
          title: "Fout",
          description: "Er is een fout opgetreden bij het maken van je ontwerp",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Ontwerp details</h2>
            <div className="bg-blue-50 text-blue-600 rounded-full px-4 py-1">
              <span className="text-sm font-medium">Credits: {credits}</span>
            </div>
          </div>

          <RoomTypeSelector onChange={setRoomType} />

          <StyleSelector onChange={setStyle} />

          <ImageUpload onUpload={setImageUrl} />

          <div className="pt-4">
            <Button onClick={handleSubmit} disabled={!imageUrl || isSubmitting} className="w-full rounded-full h-12">
              {isSubmitting ? (
                "Bezig met genereren..."
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Genereer ontwerp
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">Dit kost 1 credit</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
