"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  index,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  index?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: (index ?? 0) * 0.1 
      }}
      whileHover={{
        scale: 1.02,
        rotateX: 5,
        rotateY: 5,
      }}
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-3d-hover transition-all duration-300 p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-gray-200/50 justify-between flex flex-col space-y-4 shadow-3d backdrop-blur-md bg-white/70 dark:bg-gray-900/70",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </motion.div>
  )
}