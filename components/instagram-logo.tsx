// This component renders the InterieurGPT logo as a standalone SVG
// You can save this as an SVG file for Instagram use
export function InstagramLogo({ size = 200 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      {/* Background gradient */}
      <rect width="200" height="200" rx="40" fill="url(#paint0_linear)" />

      {/* Decorative elements */}
      <circle cx="160" cy="40" r="20" fill="#63B3ED" fillOpacity="0.3" />
      <circle cx="40" cy="160" r="15" fill="#63B3ED" fillOpacity="0.2" />

      {/* House icon with interior design elements */}
      <path
        d="M50 90L100 50L150 90V150C150 155.523 145.523 160 140 160H60C54.4772 160 50 155.523 50 150V90Z"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M90 160V110H110V160"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Window element */}
      <rect x="125" y="70" width="10" height="10" fill="white" />

      {/* Furniture element */}
      <line
        x1="70"
        y1="130"
        x2="90"
        y2="130"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Gradient definitions */}
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="0"
          y1="0"
          x2="200"
          y2="200"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" /> {/* blue-500 */}
          <stop offset="1" stopColor="#1D4ED8" /> {/* blue-700 */}
        </linearGradient>
      </defs>
    </svg>
  );
}

// Example usage in a page:
export default function LogoExportPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">
        InterieurGPT Logo for Instagram
      </h1>
      <div className="border p-8 rounded-xl bg-white shadow-md">
        <InstagramLogo size={200} />
      </div>
      <p className="mt-8 text-center text-gray-500 max-w-md">
        Right-click on the logo and select "Save image as..." to download it for
        Instagram use. For best results, save it as PNG or SVG format.
      </p>
    </div>
  );
}
