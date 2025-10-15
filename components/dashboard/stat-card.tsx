import type React from "react"

interface StatCardProps {
  title: string
  value: string | number
  change?: React.ReactNode
  icon?: React.ReactNode
  chart?: React.ReactNode
  subtitle?: React.ReactNode
  className?: string
}

export function StatCard({
  title,
  value,
  change = null,
  icon = null,
  chart = null,
  subtitle = null,
  className = "",
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg border p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-gray-500">{title}</h3>
        {icon && <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">{icon}</div>}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {change && <p className="text-xs text-gray-500 mt-1">{change}</p>}
      {subtitle && <div className="mt-2">{subtitle}</div>}
      {chart && <div className="h-20 mt-4">{chart}</div>}
    </div>
  )
}
