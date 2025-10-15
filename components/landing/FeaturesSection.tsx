"use client"

import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid"
import { features } from "./data"

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background with subtle liquid effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-100/5 dark:from-gray-800 dark:via-gray-900 dark:to-secondary-100/5"></div>
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 dark:border-primary-100/10 mb-6">
            <span className="text-primary-100 text-sm font-medium">
              ✨ Platform Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Key Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Discover how Afrivas enhances communication, collaboration, and transparency in education.
          </p>
        </div>
        
        <BentoGrid className="max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <BentoGridItem
              key={index}
              index={index}
              title={feature.title}
              description={feature.description}
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary-100/10 to-lemon-100/10 dark:from-primary-100/5 dark:to-lemon-100/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-shimmer-gradient opacity-20 animate-shimmer"></div>
                </div>
              }
              icon={
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100/10 dark:bg-primary-100/5 border border-primary-100/20 shadow-glass">
                  <feature.icon className="h-6 w-6 text-primary-100" />
                </div>
              }
              className={index === 1 || index === 4 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}