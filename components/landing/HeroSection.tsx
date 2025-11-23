"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { LiquidGlass } from "@/components/aceternity/liquid-glass"
import { FloatingElements } from "@/components/aceternity/floating-elements"
import { LandingImageSlider } from "./LandingImageSlider"

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden min-h-screen flex items-center">
      <LiquidGlass className="absolute inset-0">
        <FloatingElements />
      </LiquidGlass>
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative space-y-8 max-w-2xl">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 dark:border-primary-100/10">
                <span className="text-primary-100 text-sm font-medium">
                  🚀 Educational Platform
                </span>
              </div>
              
              <div className="space-y-4">
                <TextGenerateEffect 
                  words="Connecting Students, Parents, and Educators" 
                  className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight"
                />
              </div>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Our innovative application bridges the gap between all stakeholders in the learning process,
                enhancing communication and collaboration for better educational outcomes.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/auth/signup">
                  <Button 
                    size="lg" 
                    className="bg-primary-100 hover:bg-primary-100/90 text-white shadow-neon-primary hover:shadow-neon-primary transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="backdrop-blur-md bg-white/10 dark:bg-black/10 border-white/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-100 rounded-md py-4 ">800+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Tutors</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary-100 dark:text-pink-100 rounded-md py-4 ">700+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-lemon-400 dark:text-lemon-100 rounded-md py-4 ">20K+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Hours Tutored</p>
              </div>
            </div>
          </div>
          
          <div className="relative mx-auto w-full max-w-lg lg:max-w-xl">
            <div className="relative">
              <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-primary-100/25 via-primary-100/10 to-lemon-100/25 blur-3xl" />
              <div className="relative z-10 flex items-center justify-center">
                {/* Slider embedded inside the hero "Join the Future" visual area */}
                <LandingImageSlider />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}