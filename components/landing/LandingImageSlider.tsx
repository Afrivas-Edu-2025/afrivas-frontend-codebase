"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const SLIDER_IMAGES = [
  {
    src: "/landing -page-slider-imgs/img1.png",
    alt: "Afrivas dashboard view",
  },
  {
    src: "/landing -page-slider-imgs/img2.png",
    alt: "Afrivas student experience",
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
    <div className="relative w-full max-w-md mx-auto">
      <div className="overflow-hidden rounded-[32px] border border-white/15 bg-black/40 shadow-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDER_IMAGES.map((image, index) => (
            <div key={image.src} className="min-w-full flex items-center justify-center bg-black">
              <div className="relative w-full aspect-[4/3] max-h-[360px]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-contain"
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
        className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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
