"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const styles = [
  { value: "modern", label: "Modern" },
  { value: "minimalistisch", label: "Minimalistisch" },
  { value: "scandinavisch", label: "Scandinavisch" },
  { value: "industrieel", label: "Industrieel" },
  { value: "bohemian", label: "Bohemian" },
  { value: "landelijk", label: "Landelijk" },
  { value: "klassiek", label: "Klassiek" },
]

interface StyleSelectorProps {
  onChange: (value: string) => void
}

export function StyleSelector({ onChange }: StyleSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Stijl</h3>
      <Tabs defaultValue="modern" onValueChange={onChange} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 h-auto">
          {styles.map((style) => (
            <TabsTrigger key={style.value} value={style.value} className="py-2 rounded-lg">
              {style.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
