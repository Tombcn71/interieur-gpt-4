import Link from "next/link";
import { Home } from "lucide-react";
import { OutlineLogo } from "@/components/outline-logo";

interface LogoProps {
  className?: string;
  variant?: "default" | "outline";
  color?: string;
}

export function Logo({
  className,
  variant = "outline",
  color = "#3B82F6",
}: LogoProps) {
  if (variant === "outline") {
    return <OutlineLogo className={className} color={color} />;
  }

  // Default logo with simple Lucide React Home icon
  return (
    <Link
      href="/"
      className={`flex items-center space-x-1.5 sm:space-x-2.5 ${className}`}>
      <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
        <Home className="w-full h-full text-blue-600" />
      </div>
      <div className="font-bold text-xl sm:text-3xl flex items-center">
        <span className="text-black">interieur</span>
        <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
          GPT
        </span>
      </div>
    </Link>
  );
}
