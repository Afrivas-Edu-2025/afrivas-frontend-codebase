"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const SLIDER_IMAGES = [
  {
    src: "/landing -page-slider-imgs/magnific_black-sierra-leonean-coll_2901328592.png",
    alt: "Afrivas diverse Sierra Leonean professionals collaboration",
  },
  {
    src: "/landing -page-slider-imgs/magnific_diverse-group-of-black-si_2901328587.png",
    alt: "Afrivas diverse group of black Sierra Leonean professionals",
  },
  {
    src: "/landing -page-slider-imgs/magnific_group-of-black-sierra-leo_2901328602.png",
    alt: "Afrivas group of black Sierra Leonean professionals",
  },
  {
    src: "/landing -page-slider-imgs/magnific_black-sierra-leonean-coll_2901328600.png",
    alt: "Afrivas black Sierra Leonean professionals collaboration",
  },
]

export function LandingImageSlider() {
  const [current, setCurrent] = useState(0)

  // Optional auto-advance every 8 seconds
  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDER_IMAGES.length)
    }, 8000)
    return () => window.clearInterval(id)
  }, [])

  const goTo = (index: number) => {
    setCurrent((index + SLIDER_IMAGES.length) % SLIDER_IMAGES.length)
  }

  const next = () => goTo(current + 1)
  const prev = () => goTo(current - 1)

  if (SLIDER_IMAGES.length === 0) return null

  return (
    <div className="relative w-[768px] mx-auto p-4   rounded-xl shadow-lg
    backdrop-blur-xl p-4 shadow-glass border transition-all duration-500 bg-white/60 dark:bg-gray-900/60 border-white/20 dark:border-gray-700/20 shadow-glass
    ">
      <div className="overflow-hidden rounded-lg border border-gray-300 shadow-inner">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDER_IMAGES.map((image, index) => (
            <div key={image.src} className="min-w-full flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] max-h-[360px]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Previous slide"
      >
        <span className="sr-only">Previous</span>
        <span className="text-lg" aria-hidden="true">
          {"‹"}
        </span>
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Next slide"
      >
        <span className="sr-only">Next</span>
        <span className="text-lg" aria-hidden="true">
          {"›"}
        </span>
      </button>

      {/* Dots */}
      <div className="mt-3 flex justify-center gap-2">
        {SLIDER_IMAGES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            className={cn(
              "h-1.5 w-1.5 rounded-full border border-white/40 transition-colors",
              index === current ? "bg-white border-white" : "bg-white/20 hover:bg-white/40",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
