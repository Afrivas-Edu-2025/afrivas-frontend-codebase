"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { steps } from "./data"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">How It Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Getting started with Afrivas is simple. Follow these steps to begin your educational journey.
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400">
                <span className="text-2xl font-bold">{index + 1}</span>
              </div>
              <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-gray-100">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-primary-100 hover:bg-blue-700 text-white">
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}