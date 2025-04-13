export function PromoBanner() {
  return (
    <div className="bg-blue-500 text-center py-3 px-4 text-white">
      <p className="text-xs sm:text-sm md:text-base font-medium">
        <span className="font-bold">PAASDAGEN AANBIEDING!</span>{" "}
        <span className="hidden xs:inline">Gebruik code </span>
        <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-bold mx-1">
          "PASEN"
        </span>{" "}
        <span className="hidden xs:inline">bij het afrekenen voor </span>
        <span className="font-bold">60%</span> korting!
      </p>
    </div>
  );
}
