import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Design } from "@/types/design";

interface DesignCardProps {
  design: Design;
}

export function DesignCard({ design }: DesignCardProps) {
  // Use a fallback image if the result or original image is not available
  const imageUrl =
    design.result_image_url || design.original_image_url || "/placeholder.svg";

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <div
            className="w-full h-full bg-gray-100"
            style={{
              backgroundImage: `url('${imageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge
              variant={design.status === "completed" ? "default" : "outline"}
              className="rounded-full">
              {design.status === "completed" ? "Voltooid" : "In behandeling"}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-col items-start gap-1">
        <h3 className="font-medium capitalize">
          {design.room_type} - {design.style}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatDate(design.created_at)}
        </p>
      </CardFooter>
    </Card>
  );
}
