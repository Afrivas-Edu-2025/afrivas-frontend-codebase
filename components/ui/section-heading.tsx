import type React from "react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeading({ title, description, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6", className)}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      {action && <div className="mt-3 sm:mt-0">{action}</div>}
    </div>
  )
}
