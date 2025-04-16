import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto md:px-8">
        <div className="items-center gap-x-12 sm:px-4 md:px-0 lg:flex">
          <div className="flex-1 sm:hidden lg:block">
            <img
              src="/images/couple.jpg"
              className=""
              alt="Interior design expert helping a client"
            />
          </div>
          <div className="max-w-xl px-4 space-y-3 mt-6 sm:px-0 md:mt-0 lg:max-w-2xl">
            <h3 className="text-blue-600 font-semibold">
              Professionele interieurontwerpen
            </h3>
            <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
              Transformeer je ruimte met hulp van onze AI-technologie
            </p>
            <p className="mt-3 text-gray-600">
              Onze geavanceerde AI-technologie helpt je om je interieur volledig
              te transformeren. Upload simpelweg een foto van je kamer, kies een
              stijl die bij je past, en ontvang binnen seconden een
              professioneel ontwerp. Met InterieurGPT kun je eindeloos
              experimenteren met verschillende stijlen zonder de hulp van een
              dure interieurontwerper.
            </p>
            <Link
              href="/dashboard/nieuw"
              className="inline-flex gap-x-1 items-center text-blue-600 hover:text-blue-500 duration-150 font-medium">
              Begin nu met ontwerpen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
