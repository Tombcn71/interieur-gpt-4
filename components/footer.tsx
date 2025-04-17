import Link from "next/link";
import {
  BookOpen,
  FileText,
  FileQuestion,
  Instagram,
  Mail,
  Twitter,
  Facebook,
  FileTerminal,
  Shield,
} from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t py-8 sm:py-10 bg-gray-50">
      <div className="container px-4">
        {/* Desktop layout (4 kolommen) - verborgen op mobiel */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {/* Logo en beschrijving */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo/house-icon.png"
                alt="InterieurGPT Logo"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              <span className="font-bold text-xl">
                <span className="text-black">interieur</span>
                <span className="text-blue-600">GPT</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Transformeer je interieur met AI-gegenereerde ontwerpen. Upload
              een foto, kies een stijl en ontvang direct een nieuw ontwerp.
            </p>
          </div>

          {/* Pagina's */}
          <div className="space-y-3">
            <h3 className="font-semibold mb-3 text-gray-800">Pagina's</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/stijlgids"
                  className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                  <BookOpen
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>Stijlgids</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/prijzen"
                  className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                  <FileText
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>Prijzen</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                  <FileQuestion
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                  <Mail
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Juridisch */}
          <div className="space-y-3">
            <h3 className="font-semibold mb-3 text-gray-800">Juridisch</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/voorwaarden"
                  className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                  <FileTerminal
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>Gebruiksvoorwaarden</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                  <Shield
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>Privacybeleid</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pers"
                  className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                  <FileText
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>Pers</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Sociale media */}
          <div className="space-y-3">
            <h3 className="font-semibold mb-3 text-gray-800">Volg ons</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://twitter.com/interieurgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="Twitter">
                <Twitter className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://facebook.com/interieurgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="Facebook">
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://instagram.com/interieurgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="Instagram">
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://tiktok.com/@interieurgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="TikTok">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
                    fill="none"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Mobiele layout - alleen zichtbaar op mobiel */}
        <div className="sm:hidden space-y-8 max-w-xs mx-auto">
          {/* Logo en beschrijving */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo/house-icon.png"
                alt="InterieurGPT Logo"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              <span className="font-bold text-xl">
                <span className="text-black">interieur</span>
                <span className="text-blue-600">GPT</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500">
              Transformeer je interieur met AI-gegenereerde ontwerpen. Upload
              een foto, kies een stijl en ontvang direct een nieuw ontwerp.
            </p>
          </div>

          {/* Pagina's en Juridisch naast elkaar op mobiel */}
          <div className="grid grid-cols-2 gap-8">
            {/* Pagina's */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-800">Pagina's</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/stijlgids"
                    className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                    <BookOpen
                      className="h-4 w-4 mr-3 text-gray-400"
                      strokeWidth={1.5}
                    />
                    <span>Stijlgids</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prijzen"
                    className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                    <FileText
                      className="h-4 w-4 mr-3 text-gray-400"
                      strokeWidth={1.5}
                    />
                    <span>Prijzen</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                    <FileQuestion
                      className="h-4 w-4 mr-3 text-gray-400"
                      strokeWidth={1.5}
                    />
                    <span>FAQ</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                    <Mail
                      className="h-4 w-4 mr-3 text-gray-400"
                      strokeWidth={1.5}
                    />
                    <span>Contact</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Juridisch */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-800">Juridisch</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/voorwaarden"
                    className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                    <FileTerminal
                      className="h-4 w-4 mr-3 text-gray-400"
                      strokeWidth={1.5}
                    />
                    <span>Voorwaarden</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                    <Shield
                      className="h-4 w-4 mr-3 text-gray-400"
                      strokeWidth={1.5}
                    />
                    <span>Privacy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pers"
                    className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                    <FileText
                      className="h-4 w-4 mr-3 text-gray-400"
                      strokeWidth={1.5}
                    />
                    <span>Pers</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Sociale media - onder Pagina's en Juridisch op mobiel */}
          <div className="space-y-3 items-center">
            <h3 className="font-semibold mb-3 text-gray-800">Volg ons</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://twitter.com/interieurgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="Twitter">
                <Twitter className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://facebook.com/interieurgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="Facebook">
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://instagram.com/interieurgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="Instagram">
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://tiktok.com/@interieurgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="TikTok">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
                    fill="none"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright sectie - werkt op zowel mobiel als desktop */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} InterieurGPT. Alle rechten
            voorbehouden.
          </p>
          <div className="flex items-center">
            <span className="text-xs text-gray-400 mr-2">
              Gemaakt in Nederland
            </span>
            <span className="inline-block w-5 h-3 bg-red-500"></span>
            <span className="inline-block w-5 h-3 bg-white border-t border-b border-gray-300"></span>
            <span className="inline-block w-5 h-3 bg-blue-500"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
