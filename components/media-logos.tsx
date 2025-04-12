export function MediaLogos() {
  const logos = [
    { name: "Business Insider", width: 120 },
    { name: "MSN", width: 80 },
    { name: "NBC", width: 70 },
    { name: "Business of Home", width: 150 },
    { name: "Yahoo News", width: 130 },
  ]

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
      {logos.map((logo, index) => (
        <div key={index} className="h-8 text-gray-400" style={{ width: logo.width }}>
          <div className="w-full h-full bg-gray-200 rounded animate-pulse flex items-center justify-center">
            <span className="text-xs text-gray-400">{logo.name}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
