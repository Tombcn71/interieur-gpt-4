import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center space-x-1 sm:space-x-2 ${className}`}>
      <div className="relative flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl shadow-md overflow-hidden">
        {/* Decorative element in the background */}
        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-blue-300 opacity-30 rounded-full transform translate-x-1 -translate-y-1"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 bg-blue-300 opacity-20 rounded-full transform -translate-x-1 translate-y-1"></div>

        {/* Custom house icon with interior design elements */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 sm:w-6 sm:h-6 relative z-10">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
          {/* Window element */}
          <rect x="16" y="5" width="2" height="2" fill="white" stroke="none" />
          {/* Furniture element */}
          <line x1="7" y1="15" x2="11" y2="15" strokeWidth="1.5" />
        </svg>
      </div>
      <span className="font-bold text-lg sm:text-2xl bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
        interieurGPT
      </span>
    </Link>
  );
}
