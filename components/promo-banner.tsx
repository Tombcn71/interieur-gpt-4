export function PromoBanner() {
  return (
    <div className="bg-black text-center py-3 px-4 text-white">
      <p className="text-sm md:text-base font-medium">
        <span className="font-bold">BLACK FRIDAY AANBIEDING!</span> Gebruik code{" "}
        <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-bold mx-1">"BF60"</span> bij het afrekenen
        voor <span className="font-bold">60%</span> korting op alle plannen!
      </p>
    </div>
  )
}
