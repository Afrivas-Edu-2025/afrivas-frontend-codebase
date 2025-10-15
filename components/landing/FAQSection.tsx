"use client"

import { Card, CardContent } from "@/components/ui/card"
import { faqs } from "./data"

export function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find answers to commonly asked questions about Afrivas.
          </p>
        </div>
        
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-0 shadow-md bg-white dark:bg-gray-900">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}