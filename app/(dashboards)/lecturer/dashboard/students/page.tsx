'use client'

import { useState, useEffect } from 'react'
import { MoreVertical, ChevronLeft, ChevronRight, UserPlus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import CreateStudentForm from '@/components/forms/CreateStudentForm'

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  program?: string
  yearOfStudy?: number
  semester?: string
  gpa?: number
  isActive?: boolean
  dateJoined?: string
  cgpa?: number
  avatar?: string
  points?: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  // Fetch students from API
  const fetchStudents = async (page = 1, search = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search })
      })

      const response = await fetch(`http://localhost:5050/api/v1/admin/users/students`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch students')
      
      const data = await response.json()
      
      // Ensure we have an array of students
      let studentsData = []
      if (Array.isArray(data)) {
        studentsData = data
      } else if (data.students && Array.isArray(data.students)) {
        studentsData = data.students
      } else if (data.data && Array.isArray(data.data)) {
        studentsData = data.data
      } else {
        console.warn('Unexpected API response format:', data)
        studentsData = []
      }
      
      setStudents(studentsData)
      setTotalPages(data.totalPages || Math.ceil((data.total || studentsData.length || 0) / itemsPerPage))
      setCurrentPage(data.currentPage || page)
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    fetchStudents(1, value)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchStudents(page, searchTerm)
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Filter students based on search term (client-side filtering as backup)
  const filteredStudents = students.filter(student => 
    !searchTerm || 
    student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Students</h1>
        <CreateStudentForm onSuccess={() => fetchStudents(currentPage, searchTerm)} />
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="TOTAL STUDENTS"
          value="457"
          change={<span className="text-green-500">↑ 6.7% Increase</span>}
          icon={<StatsIcon className="text-blue-500" />}
        />
        <StatCard
          title="GENDER BALANCE"
          value={
            <>
              M: <span className="text-blue-500">347</span> - F: <span className="text-pink-500">110</span>
            </>
          }
          change={<span className="text-red-500">↓ 13.5% Decrease</span>}
          icon={<StatsIcon className="text-amber-500" />}
        />
        <StatCard
          title="ATTENDANCE RATE"
          value="9.73%"
          change={<span className="text-green-500">↑ 3.5% Increase</span>}
          icon={<StatsIcon className="text-green-500" />}
        />
      </div>

      {/* Top Students */}
      <div>
        <h2 className="text-xl font-bold mb-4">Top Students</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {topStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-lg overflow-hidden border shadow-sm">
              <div className={`h-32 ${student.bgColor}`}>
                <img
                  src={student.avatar || "/placeholder.svg"}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.points} Points</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Students */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Students</h2>
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Users
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Semester
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    CGPA
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Loading students...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={student.avatar || "/placeholder.svg"}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{student.firstName} {student.lastName}</p>
                            {student.isActive !== undefined && (
                              <Badge variant={student.isActive ? "default" : "secondary"} className="text-xs">
                                {student.isActive ? "Active" : "Inactive"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.phoneNumber || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.dateJoined || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.semester || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.gpa?.toFixed(2) || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-500">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
              <span className="font-medium">16</span> entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">01</button>
              <button className="px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white">02</button>
              <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">03</button>
              <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">04</button>
              <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">05</button>
              <button className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-gray-500">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-xl font-bold mb-1">{value}</p>
      <p className="text-xs">{change}</p>
    </div>
  )
}

function StatsIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
}

const topStudents = [
  {
    id: 1,
    name: "Alex James",
    avatar: "/placeholder.svg?height=128&width=128",
    points: "105 Points",
    bgColor: "bg-pink-100",
  },
  {
    id: 2,
    name: "Esther Kamara",
    avatar: "/placeholder.svg?height=128&width=128",
    points: "97 Points",
    bgColor: "bg-gray-100",
  },
  {
    id: 3,
    name: "Isata Kai",
    avatar: "/placeholder.svg?height=128&width=128",
    points: "95 Points",
    bgColor: "bg-amber-50",
  },
  {
    id: 4,
    name: "Alieu Vandy",
    avatar: "/placeholder.svg?height=128&width=128",
    points: "86 Points",
    bgColor: "bg-gray-100",
  },
  {
    id: 5,
    name: "Hassan Bai-Turay",
    avatar: "/placeholder.svg?height=128&width=128",
    points: "81 Points",
    bgColor: "bg-blue-50",
  },
]

const students = [
  {
    id: 1,
    name: "Christian Abu",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "debra.holt@example.com",
    phone: "(099) 555-011",
    dateJoined: "Jun 10th, 2024",
    semester: "5",
    cgpa: "3.4",
  },
  {
    id: 2,
    name: "Messiah Henry",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "tim.jennings@example.com",
    phone: "(077) 555-011",
    dateJoined: "Jun 10th, 2024",
    semester: "2",
    cgpa: "3.8",
  },
  {
    id: 3,
    name: "Isaiah Williamson",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "michelle.rivera@example.com",
    phone: "(033) 555-012",
    dateJoined: "Jan 02th, 2025",
    semester: "6",
    cgpa: "2.9",
  },
  {
    id: 4,
    name: "Jacob Jones",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "tanya.hill@example.com",
    phone: "(099) 555-010",
    dateJoined: "Feb 14th, 2025",
    semester: "3",
    cgpa: "4.0",
  },
  {
    id: 5,
    name: "Leslie Coker",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "alma.lawson@example.com",
    phone: "(077) 555-011",
    dateJoined: "Feb 18th, 2025",
    semester: "7",
    cgpa: "3.6",
  },
]
