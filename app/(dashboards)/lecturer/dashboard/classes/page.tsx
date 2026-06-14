'use client'

import { useMemo } from "react"
import { Users, Calendar, Clock, MapPin } from "lucide-react"
import { useGetMyClassesQuery } from '@/services/adminApi'

function formatTime(d: Date | string) {
  const date = new Date(d)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const daysOrder = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"]

export default function ClassesPage() {
  const { data: apiResponse, isLoading, error } = useGetMyClassesQuery()
  const classes = apiResponse?.data ?? []

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()

  const todaysClasses = useMemo(() => {
    return classes.filter((c) => c.day?.toUpperCase() === today)
  }, [classes, today])

  const totalStudents = useMemo(() => {
    const set = new Set<number>()
    // we don't have per-class student count from this endpoint, so estimate unique modules
    return classes.length
  }, [classes])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <p className="text-gray-500">Loading classes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <p className="text-red-500">Failed to load classes</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Classes</h1>
          <p className="text-gray-500">Classes for your assigned modules</p>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-8 text-center text-gray-500">
          No classes found for your assigned modules.
        </div>
      ) : (
        <>
          {/* Class Overview Cards - grouped by module */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((c) => (
              <div
                key={c.classId}
                className="bg-white dark:bg-gray-900 rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-32 bg-blue-500 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{c.moduleName}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{c.moduleCode}</p>
                  {c.description && (
                    <p className="text-sm text-gray-600 mb-4">{c.description}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{c.day}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(c.startTime)} - {formatTime(c.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{c.classLocation}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Schedule */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-medium">Today&apos;s Schedule</h2>
            </div>

            {todaysClasses.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No classes scheduled for today.</div>
            ) : (
              <div className="divide-y dark:divide-gray-700">
                {todaysClasses.map((c) => (
                  <div key={c.classId} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{c.moduleName}</h3>
                            <p className="text-sm text-gray-500">{c.moduleCode}</p>
                          </div>
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Scheduled
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{formatTime(c.startTime)} - {formatTime(c.endTime)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{c.classLocation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Classes"
              value={String(classes.length)}
              description="Across all modules"
              color="bg-blue-50"
              textColor="text-blue-600"
            />
            <StatCard
              title="Total Modules"
              value={String(new Set(classes.map((c: any) => c.moduleId)).size)}
              description="Assigned to you"
              color="bg-green-50"
              textColor="text-green-600"
            />
            <StatCard
              title="Classes Today"
              value={String(todaysClasses.length)}
              description={new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              color="bg-purple-50"
              textColor="text-purple-600"
            />
            <StatCard
              title="Unique Days"
              value={String(new Set(classes.map((c: any) => c.day?.toUpperCase())).size)}
              description="Days with classes"
              color="bg-amber-50"
              textColor="text-amber-600"
            />
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ title, value, description, color, textColor }: { title: string; value: string; description: string; color: string; textColor: string }) {
  return (
    <div className={`rounded-lg border p-6 shadow-sm ${color}`}>
      <h3 className="text-xs font-medium text-gray-500 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  )
}