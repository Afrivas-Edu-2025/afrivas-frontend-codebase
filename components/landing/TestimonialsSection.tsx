"use client"

import { WobbleCard } from "@/components/aceternity/wobble-card"
import { testimonials } from "./data"

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background with liquid effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-secondary-100/5 dark:from-gray-900 dark:via-gray-800 dark:to-primary-100/5"></div>
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary-100/10 dark:bg-secondary-100/5 backdrop-blur-md border border-secondary-100/20 dark:border-secondary-100/10 mb-6">
            <span className="text-secondary-100 text-sm font-medium">
              💬 User Reviews
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Hear from students, teachers, and parents who have transformed their educational experience with Afrivas.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <WobbleCard key={index} containerClassName="col-span-1 min-h-[300px]">
              <div className="max-w-xs">
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100/20 to-lemon-100/20 flex items-center justify-center text-2xl font-bold text-primary-100 shadow-glass">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">{testimonial.name}</h3>
                    <p className="text-sm text-primary-100 font-medium">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                
                <div className="flex text-lemon-100">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                </div>
              </div>
            </WobbleCard>
          ))}
        </div>
      </div>
    </section>
  )
}