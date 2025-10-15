import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  rows?: number
  columns?: number
  showHeader?: boolean
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  showHeader = true 
}: TableSkeletonProps) {
  return (
    <Card>
      {showHeader && (
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          {/* Table Header */}
          {showHeader && (
            <div className="grid grid-cols-4 gap-4 pb-2 border-b">
              {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          )}
          
          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-4 py-2">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function UserTableSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 pb-2 border-b">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          
          {/* Table Rows */}
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
