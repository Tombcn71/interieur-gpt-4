import Link from "next/link";
import { Home } from "lucide-react";

interface OutlineLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  color?: string;
}

export function OutlineLogo({
  className = "",
  size = "md",
  asLink = true,
  color = "#3B82F6",
}: OutlineLogoProps) {
  // Size mapping
  const sizeMap = {
    sm: {
      container: "w-5 h-5",
      textSize: "text-xl",
      spacing: "space-x-1.5",
    },
    md: {
      container: "w-6 h-6",
      textSize: "text-2xl",
      spacing: "space-x-2",
    },
    lg: {
      container: "w-7 h-7",
      textSize: "text-3xl",
      spacing: "space-x-2.5",
    },
  };

  const logoContent = (
    <div
      className={`inline-flex items-center ${sizeMap[size].spacing} ${className}`}>
      <div
        className={`relative ${sizeMap[size].container} flex items-center justify-center`}>
        <Home className="w-full h-full" style={{ color }} />
      </div>
      <div className={`font-bold ${sizeMap[size].textSize} flex items-center`}>
        <span className="text-black">interieur</span>
        <span
          className="text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, ${color}, ${color})`,
          }}>
          GPT
        </span>
      </div>
    </div>
  );

  if (asLink) {
    return <Link href="/">{logoContent}</Link>;
  }

  return logoContent;
}
