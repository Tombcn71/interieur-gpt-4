"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export function BeforeAfterShowcase() {
  const [isHovered, setIsHovered] = useState(false)

  // Use static placeholder images instead of dynamic ones
  const beforeImage = "/placeholder.svg"
  const afterImage = "/placeholder.svg"

  return (
    <div className="relative">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
        <Button className="rounded-full h-12 px-6 shadow-lg" variant="default">
          <Zap className="mr-2 h-4 w-4" />
          Direct Herontwerpen
        </Button>
      </div>

      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700 ease-in-out"
            style={{
              transform: isHovered ? "translateX(-100%)" : "translateX(0)",
              backgroundImage: `url('${beforeImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute inset-0 transition-transform duration-700 ease-in-out"
            style={{
              transform: isHovered ? "translateX(0)" : "translateX(100%)",
              backgroundImage: `url('${afterImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1 font-medium text-sm">
            {isHovered ? "Na" : "Voor"}
          </div>
        </div>
      </div>
    </div>
  )
}
