// This component provides a clean SVG export of the logo
// You can copy this SVG code directly for use in other platforms

export function LogoSVG() {
  return (
    <svg
      width="200"
      height="200"
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
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
