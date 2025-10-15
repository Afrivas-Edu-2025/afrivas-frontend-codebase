'use client'

import { useState } from "react"
import { ArrowRight, Plus, Edit, Trash2, Eye } from "lucide-react"
import CreateFacultyForm from '@/components/forms/CreateFacultyForm'
import { useGetFacultiesQuery, useDeleteFacultyMutation } from '@/services/adminApi'
import { Faculty } from '@/services/adminApi'
import { toast } from 'sonner'

export default function FacultyPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { data: facultiesData, isLoading, error, refetch } = useGetFacultiesQuery()
  const [deleteFaculty] = useDeleteFacultyMutation()

  const handleDeleteFaculty = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete faculty "${name}"? This action cannot be undone.`)) {
      try {
        await deleteFaculty(id).unwrap()
        toast.success('Faculty deleted successfully')
        refetch()
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete faculty')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading faculties...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading faculties. Please try again.</div>
      </div>
    )
  }

  const faculties = facultiesData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Faculty Management</h1>
          <p className="text-gray-500">Manage and analyze faculty data across the institution</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => refetch()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
              <path d="M16 5h6v6" />
              <path d="M8 21v-4a4 4 0 0 1 4-4h9" />
            </svg>
            Sync Faculty Data
          </button>
          <CreateFacultyForm onSuccess={() => refetch()} />
        </div>
      </div>

      {/* Faculty Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Total Faculties</h3>
          <p className="text-3xl font-bold text-blue-600">{faculties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Active Faculties</h3>
          <p className="text-3xl font-bold text-green-600">{faculties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Total Departments</h3>
          <p className="text-3xl font-bold text-purple-600">
            {faculties.reduce((acc, faculty) => acc + (faculty.departmentCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Faculty List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">All Faculties</h2>
          {faculties.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No faculties found. Create your first faculty to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Departments</th>
                    <th className="text-left py-3 px-4 font-medium">Students</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculties.map((faculty) => (
                    <tr key={faculty.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{faculty.name}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {faculty.description || 'No description'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {faculty.departmentCount || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {faculty.studentCount || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(faculty.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-1 text-yellow-600 hover:text-yellow-800"
                            title="Edit Faculty"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteFaculty(faculty.id, faculty.name)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete Faculty"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Overview</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Staff Reports</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            Performance Analysis
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            Enrollment Reports
          </button>
        </nav>
      </div>

      {/* Faculty Performance Analysis */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Faculty Performance Analysis</h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded-md text-sm flex items-center gap-1">
              <span>Department Metrics</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <h3 className="text-md font-bold mb-4">Performance metrics and rankings</h3>

          <div className="border-b mb-4">
            <nav className="flex space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                Graduation Rates
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Success Rate</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Faculty Ranking
              </button>
            </nav>
          </div>

          <div className="h-80">
            <GraduationRatesChart />
          </div>
        </div>
      </div>
    </div>
  )
}

function GraduationRatesChart() {
  const faculties = [
    { name: "FICT", rate: 85, color: "bg-blue-500" },
    { name: "FMBA", rate: 92, color: "bg-green-500" },
    { name: "FICT", rate: 45, color: "bg-yellow-500" },
    { name: "BSEM", rate: 32, color: "bg-red-500" },
  ]

  return (
    <div className="w-full h-full flex items-end justify-around">
      {faculties.map((faculty, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className={`w-16 ${faculty.color} rounded-t-sm`} style={{ height: `${faculty.rate * 2}px` }}></div>
          <span className="mt-2 text-sm">{faculty.name}</span>
          <span className="text-sm font-medium">{faculty.rate}% Graduation Rate</span>
        </div>
      ))}
    </div>
  )
}
