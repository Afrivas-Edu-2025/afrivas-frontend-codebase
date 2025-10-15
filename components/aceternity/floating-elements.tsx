"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const floatingVariants2 = {
  animate: {
    y: [0, 15, 0],
    x: [0, -8, 0],
    rotate: [0, -3, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1
    }
  }
}

const floatingVariants3 = {
  animate: {
    y: [0, -10, 0],
    x: [0, 5, 0],
    rotate: [0, 8, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2
    }
  }
}

export const FloatingElements = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {/* Floating geometric shapes */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg shadow-neon-primary opacity-20 dark:opacity-40"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      />
      
      <motion.div
        variants={floatingVariants2}
        animate="animate"
        className="absolute bottom-32 left-16 w-12 h-12 bg-gradient-to-br from-lemon-100 to-lemon-200 rounded-full shadow-neon-lemon opacity-30 dark:opacity-50"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      />
      
      <motion.div
        variants={floatingVariants3}
        animate="animate"
        className="absolute top-1/2 right-1/4 w-8 h-20 bg-gradient-to-br from-secondary-100 to-secondary-300 rounded-full shadow-neon-secondary opacity-25 dark:opacity-45"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      />
      
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-20 right-1/3 w-6 h-6 bg-gradient-to-br from-primary-100 to-lemon-100 rounded-full shadow-glass opacity-30"
        style={{ 
          perspective: "1000px", 
          transformStyle: "preserve-3d",
          animation: "liquid-float 6s ease-in-out infinite"
        }}
      />
      
      <motion.div
        variants={floatingVariants2}
        animate="animate"
        className="absolute top-1/4 left-1/3 w-10 h-10 bg-gradient-to-br from-secondary-100/50 to-primary-100/50 transform rotate-45 shadow-glass opacity-20 dark:opacity-40"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      />
    </div>
  )
}