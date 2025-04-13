export function PromoBanner() {
  return (
    <div className="bg-blue-500 text-center py-3 px-4 text-white">
      <p className="text-xs sm:text-sm md:text-base font-medium">
        <span className="font-bold">PAASDAGEN AANBIEDING!</span>{" "}
        <span className="">Gebruik code </span>
        <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-bold mx-1">
          "BF60"
        </span>{" "}
        <span className=""> voor </span>
        <span className="font-bold">50%</span> korting!
      </p>
    </div>
  );
}
