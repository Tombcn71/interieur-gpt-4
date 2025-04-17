import Link from "next/link";
import Image from "next/image";

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
  return (
    <Link
      href="/"
      className={`flex items-center space-x-1.5 sm:space-x-2.5 ${className}`}>
      <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
        <Image
          src="/images/logo/house-icon.png"
          alt="InterieurGPT Logo"
          width={28}
          height={28}
          className="w-full h-full object-contain"
        />
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
