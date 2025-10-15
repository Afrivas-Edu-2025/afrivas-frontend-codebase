"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import React, { useRef } from "react"
import { cn } from "@/lib/utils"

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode
  containerClassName?: string
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"]
  )
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-17.5deg", "17.5deg"]
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "mx-auto w-full bg-gradient-to-br from-primary-100/10 to-secondary-100/10 relative rounded-2xl shadow-3d overflow-hidden backdrop-blur-sm border border-white/20 dark:border-gray-800/20",
        containerClassName
      )}
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className={cn("h-full px-4 py-20 sm:px-10", className)}
      >
        {children}
      </div>
    </motion.div>
  )
}