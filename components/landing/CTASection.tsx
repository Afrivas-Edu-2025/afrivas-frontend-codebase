"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WavyBackground } from "@/components/aceternity/wavy-background"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <WavyBackground 
        containerClassName="!h-auto min-h-[600px]"
        colors={[
          "rgba(8, 177, 248, 0.15)", 
          "rgba(8, 5, 114, 0.1)", 
          "rgba(214, 242, 5, 0.12)"
        ]}
        waveOpacity={0.3}
        blur={15}
        speed="slow"
      >
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-20">
          <div className="rounded-3xl bg-gradient-to-br from-primary-100 via-primary-100/95 to-secondary-100 p-8 md:p-16 shadow-3d backdrop-blur-sm border border-white/20 relative overflow-hidden">
            {/* Liquid glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm"></div>
            
            {/* Floating elements */}
            <div className="absolute top-8 right-8 w-12 h-12 bg-lemon-100/30 rounded-full blur-sm animate-float"></div>
            <div className="absolute bottom-8 left-8 w-8 h-8 bg-white/20 rounded-full blur-sm animate-liquid-float"></div>
            
            <div className="md:flex md:items-center md:justify-between relative z-10">
              <div className="mb-8 md:mb-0 md:max-w-2xl">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6">
                  <span className="text-white text-sm font-medium">
                    🚀 Join the Future of Education
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                  Ready to Transform Education?
                </h2>
                
                <p className="text-white/90 text-xl leading-relaxed mb-8">
                  Join thousands of schools already using Afrivas to enhance communication and improve student outcomes.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link href="/auth/signup">
                    <Button 
                      size="lg" 
                      className="bg-white text-primary-100 hover:bg-gray-100 shadow-3d hover:shadow-3d-hover transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl group"
                    >
                      Get Started Now
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#contact-us">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-white border-white/30 hover:bg-white/10 backdrop-blur-md transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl"
                    >
                      Contact Sales
                    </Button>
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="mt-12 grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">10K+</div>
                    <div className="text-white/80 text-sm">Active Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">500+</div>
                    <div className="text-white/80 text-sm">Schools</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">98%</div>
                    <div className="text-white/80 text-sm">Satisfaction</div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-lemon-100/30 to-white/30 rounded-full blur-xl animate-pulse-glow"></div>
                  <div className="relative w-64 h-64 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-glass animate-float">
                    <div className="text-6xl">🎓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WavyBackground>
    </section>
  )
}