"use client"

import FAQ1 from "../effect-components/faq-monochrome"

export function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24" style={{background: `radial-gradient(ellipse 50% 100% at 10% 0%, hsl(var(--secondary) / 0.15), transparent 65%)`}}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find answers to commonly asked questions about Afrivas.
          </p>
        </div>
        <FAQ1 />
      </div>
    </section>
  )
}