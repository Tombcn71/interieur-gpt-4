import { Star } from "lucide-react"

interface Review {
  id: number
  name: string
  location: string
  rating: number
  text: string
}

export function ReviewsSection() {
  const reviews: Review[] = [
    {
      id: 1,
      name: "Lisa Jansen",
      location: "Amsterdam",
      rating: 5,
      text: "Ik was verbaasd over hoe snel en eenvoudig het was om mijn woonkamer te transformeren. Het resultaat was verbluffend!",
    },
    {
      id: 2,
      name: "Mark de Vries",
      location: "Rotterdam",
      rating: 5,
      text: "InterieurGPT heeft me geholpen om mijn slaapkamer in een moderne oase te veranderen. Ik ben erg tevreden met het resultaat.",
    },
    {
      id: 3,
      name: "Emma Bakker",
      location: "Utrecht",
      rating: 4,
      text: "Als interieurontwerper gebruik ik InterieurGPT om snel ideeën te genereren voor mijn klanten. Het bespaart me zoveel tijd!",
    },
    {
      id: 4,
      name: "Thomas Visser",
      location: "Den Haag",
      rating: 5,
      text: "Ik twijfelde eerst, maar na het zien van de resultaten ben ik overtuigd. Mijn keuken ziet er nu fantastisch uit!",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Wat onze gebruikers zeggen</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Duizenden mensen hebben hun interieur al getransformeerd met InterieurGPT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>

              <p className="text-gray-600 flex-grow">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
