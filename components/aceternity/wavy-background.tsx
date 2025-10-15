"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any
  className?: string
  containerClassName?: string
  colors?: string[]
  waveWidth?: number
  backgroundFill?: string
  blur?: number
  speed?: "slow" | "fast"
  waveOpacity?: number
  [key: string]: any
}) => {
  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center relative overflow-hidden",
        containerClassName
      )}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='87' height='50.38' patternTransform='scale(2) rotate(0)'%3e%3crect x='0' y='0' width='100%25' height='100%25' fill='hsla(259, 0%25, 100%25, 0)'/%3e%3cpath d='M0 54.424l14.5-8.373c4.813-2.779 9.627-5.558 14.5-5.558s9.688 2.779 14.5 5.558 9.688 5.558 14.5 5.558 9.688-2.779 14.5-5.558C77.312 43.272 82.125 40.493 87 40.493V54.424H0z' fill='hsla(266, 47%25, 55%25, 0.05)'/%3e%3cpath d='M0 69.424l14.5-8.373c4.813-2.779 9.627-5.558 14.5-5.558s9.688 2.779 14.5 5.558 9.688 5.558 14.5 5.558 9.688-2.779 14.5-5.558C77.312 58.272 82.125 55.493 87 55.493V69.424H0z' fill='hsla(266, 47%25, 55%25, 0.08)'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23a)'/%3e%3c/svg%3e")`,
        }}
      />
      
      {/* Animated wave layers */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            translateX: [0, -100],
          }}
          transition={{
            duration: speed === "fast" ? 10 : 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors?.[0] || "rgba(8, 177, 248, 0.1)"}, transparent)`,
            filter: `blur(${blur}px)`,
          }}
        />
        
        <motion.div
          animate={{
            translateX: [0, 100],
          }}
          transition={{
            duration: speed === "fast" ? 15 : 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors?.[1] || "rgba(8, 5, 114, 0.1)"}, transparent)`,
            filter: `blur(${blur * 1.2}px)`,
          }}
        />
        
        <motion.div
          animate={{
            translateX: [0, -80],
          }}
          transition={{
            duration: speed === "fast" ? 12 : 22,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 opacity-25"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors?.[2] || "rgba(214, 242, 5, 0.1)"}, transparent)`,
            filter: `blur(${blur * 0.8}px)`,
          }}
        />
      </div>

      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  )
}