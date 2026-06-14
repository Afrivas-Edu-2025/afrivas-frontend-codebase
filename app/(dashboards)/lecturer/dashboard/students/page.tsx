'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useGetMyStudentsQuery } from '@/services/adminApi'

export default function StudentsPage() {
  const { data: apiResponse, isLoading, error } = useGetMyStudentsQuery()
  const students = apiResponse?.data?.students ?? []
  const classes = apiResponse?.data?.classes ?? []

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filterClass, setFilterClass] = useState('all')
  const [filterModule, setFilterModule] = useState('all')
  const [filterSemester, setFilterSemester] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterFaculty, setFilterFaculty] = useState('all')
  const itemsPerPage = 10

  const uniqueModules = useMemo(() => {
    const map = new Map<number, string>()
    for (const s of students) {
      if (!map.has(s.moduleId)) map.set(s.moduleId, s.moduleName)
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [students])

  const uniqueSemesters = useMemo(() => {
    const map = new Map<number, string>()
    for (const s of students) {
      if (!map.has(s.semesterId)) map.set(s.semesterId, s.semesterName)
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [students])

  const uniqueDepartments = useMemo(() => {
    const set = new Set<string>()
    for (const s of students) set.add(s.departmentName)
    return Array.from(set).sort()
  }, [students])

  const uniqueFaculties = useMemo(() => {
    const set = new Set<string>()
    for (const s of students) set.add(s.facultyName)
    return Array.from(set).sort()
  }, [students])

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        if (!s.firstName?.toLowerCase().includes(q) &&
            !s.lastName?.toLowerCase().includes(q) &&
            !s.email?.toLowerCase().includes(q)) return false
      }
      if (filterClass !== 'all' && s.className !== filterClass) return false
      if (filterModule !== 'all' && s.moduleId !== Number(filterModule)) return false
      if (filterSemester !== 'all' && s.semesterId !== Number(filterSemester)) return false
      if (filterDepartment !== 'all' && s.departmentName !== filterDepartment) return false
      if (filterFaculty !== 'all' && s.facultyName !== filterFaculty) return false
      return true
    })
  }, [students, searchTerm, filterClass, filterModule, filterSemester, filterDepartment, filterFaculty])

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage))
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalCount = students.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Students</h1>
        <p className="text-sm text-muted-foreground">{totalCount} student{totalCount !== 1 ? 's' : ''} enrolled</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label>Class</Label>
              <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setCurrentPage(1) }}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.day} - {c.classLocation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Module</Label>
              <Select value={filterModule} onValueChange={(v) => { setFilterModule(v); setCurrentPage(1) }}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueModules.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Semester</Label>
              <Select value={filterSemester} onValueChange={(v) => { setFilterSemester(v); setCurrentPage(1) }}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueSemesters.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Department</Label>
              <Select value={filterDepartment} onValueChange={(v) => { setFilterDepartment(v); setCurrentPage(1) }}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueDepartments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Faculty</Label>
              <Select value={filterFaculty} onValueChange={(v) => { setFilterFaculty(v); setCurrentPage(1) }}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueFaculties.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">Loading students...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-red-500">Failed to load students</td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No students found</td>
                </tr>
              ) : (
                paginatedStudents.map((s, i) => (
                  <tr key={`${s.userId}-${s.moduleId}-${i}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                          {s.firstName?.[0]}{s.lastName?.[0]}
                        </div>
                        <p className="font-medium text-sm">{s.firstName} {s.lastName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.moduleName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.semesterName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.facultyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.departmentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.levelName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {String(page).padStart(2, '0')}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}