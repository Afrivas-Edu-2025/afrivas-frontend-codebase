"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const LiquidGlass = ({ 
  className,
  children 
}: { 
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 bg-liquid-gradient">
        {/* Animated Blobs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary-100/30 to-lemon-100/30 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-secondary-100/20 to-primary-100/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-lemon-100/10 to-primary-100/10 rounded-full blur-3xl"
        />
      </div>
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/5 dark:bg-black/10 backdrop-blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}