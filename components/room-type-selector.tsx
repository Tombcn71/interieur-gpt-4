"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const roomTypes = [
  { value: "woonkamer", label: "Woonkamer" },
  { value: "slaapkamer", label: "Slaapkamer" },
  { value: "keuken", label: "Keuken" },
  { value: "badkamer", label: "Badkamer" },
  { value: "eetkamer", label: "Eetkamer" },
  { value: "kantoor", label: "Kantoor" },
  { value: "kinderkamer", label: "Kinderkamer" },
]

interface RoomTypeSelectorProps {
  onChange: (value: string) => void
}

export function RoomTypeSelector({ onChange }: RoomTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="roomType">Kamertype</Label>
      <Select onValueChange={onChange} defaultValue="woonkamer">
        <SelectTrigger id="roomType" className="w-full rounded-xl">
          <SelectValue placeholder="Selecteer kamertype" />
        </SelectTrigger>
        <SelectContent>
          {roomTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
