import Image from "next/image"
import Link from "next/link"
import {
    Facebook,
    Instagram,
    Youtube,
    MessageCircle,
  } from "lucide-react"

const INSTAGRAM_URL = "https://www.instagram.com/afrivas_llc?igsh=MXhhZzFjZXh4aGc2Nw==&utm_source=ig_contact_invite"
const FACEBOOK_URL = "https://www.facebook.com/share/15QcvDt8ew/?mibextid=wwXIfr"
const YOUTUBE_URL = "https://youtube.com/@afrivasllc?si=96mzK8ZNR5LAj0co"
const WHATSAPP_URL = "https://whatsapp.com/channel/0029Vb64oKD2phHMG5ZoHF3s"

export default function Footer(){

    return(
        <>
        <footer className="border-t bg-white py-12 dark:bg-gray-900 dark:border-gray-800">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/images/logo.webp" width={40} height={40} alt="Logo" className="rounded-md" />
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Afrivas</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connecting students, parents, and educators for better educational outcomes.
              </p>
              <div className="flex space-x-4">
                <Link
                  href={FACEBOOK_URL}
                  aria-label="Facebook"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href={INSTAGRAM_URL}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href={YOUTUBE_URL}
                  aria-label="YouTube"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
                <Link
                  href={WHATSAPP_URL}
                  aria-label="WhatsApp"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
                >
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Quick Links</h3>
              <ul className="space-y-2">
                {["Home", "About Us", "Features", "Pricing", "Contact Us"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Resources</h3>
              <ul className="space-y-2">
                {["Blog", "Help Center", "Tutorials", "FAQs", "Community"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Legal</h3>
              <ul className="space-y-2">
                {["Terms of Service", "Privacy Policy", "Cookie Policy", "Data Protection", "Accessibility"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        {item}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Afrivas. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
        </>
    )
}