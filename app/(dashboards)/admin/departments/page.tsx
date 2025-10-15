'use client'

import { useState } from "react"
import { ArrowRight, Plus, Edit, Trash2, Eye } from "lucide-react"
import CreateDepartmentForm from '@/components/forms/CreateDepartmentForm'
import { useGetDepartmentsQuery, useDeleteDepartmentMutation } from '@/services/adminApi'
import { toast } from 'sonner'

export default function DepartmentsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { data: departmentsData, isLoading, error, refetch } = useGetDepartmentsQuery()
  const [deleteDepartment] = useDeleteDepartmentMutation()

  const handleDeleteDepartment = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete department "${name}"? This action cannot be undone.`)) {
      try {
        await deleteDepartment(id).unwrap()
        toast.success('Department deleted successfully')
        refetch()
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete department')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading departments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading departments. Please try again.</div>
      </div>
    )
  }

  const departments = departmentsData?.data || []
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Department</h1>
          <p className="text-gray-500">Manage and analyze department data across the institution</p>
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
            Sync Department Data
          </button>
          <CreateDepartmentForm onSuccess={() => refetch()} />
        </div>
      </div>

      {/* Department Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Total Departments</h3>
          <p className="text-3xl font-bold text-blue-600">{departments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Active Departments</h3>
          <p className="text-3xl font-bold text-green-600">{departments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-purple-600">1,234</p>
        </div>
      </div>

      {/* Department List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">All Departments</h2>
          {departments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No departments found. Create your first department to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Faculty</th>
                    <th className="text-left py-3 px-4 font-medium">Students</th>
                    <th className="text-left py-3 px-4 font-medium">Courses</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department) => (
                    <tr key={department.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{department.name}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {department.faculty?.name || 'Not assigned'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          0 Students
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          0 Courses
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(department.createdAt).toLocaleDateString()}
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
                            title="Edit Department"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(department.id, department.name)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete Department"
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
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            Course Performance
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Enrollment Trends</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            Lecturer Performance
          </button>
        </nav>
      </div>

      {/* Department Overview Dashboard */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Department Overview Dashboard</h2>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1 border rounded-md text-sm">
              <option>FICT</option>
              <option>Engineering</option>
              <option>Business</option>
              <option>Arts</option>
            </select>
            <button className="px-3 py-1 border rounded-md text-sm flex items-center gap-1">
              <span>Department Metrics</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Department Metrics */}
        <div className="mb-8">
          <h3 className="text-md font-bold mb-4">Department Metrics</h3>
          <p className="text-sm text-gray-500 mb-6">Key metrics for departments in the Engineering faculty</p>

          <div className="border-b mb-4">
            <nav className="flex space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                Lecturers
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Courses</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Class Utilization
              </button>
            </nav>
          </div>

          <div className="h-80">
            <DepartmentMetricsChart />
          </div>
        </div>
      </div>
    </div>
  )
}

function DepartmentMetricsChart() {
  const departments = [
    { name: "Engineering", students: 350, color: "bg-blue-500" },
    { name: "Law", students: 240, color: "bg-green-500" },
    { name: "Architecture", students: 180, color: "bg-purple-500" },
    { name: "Medicine", students: 120, color: "bg-red-500" },
  ]

  return (
    <div className="w-full h-full flex items-end justify-around">
      {departments.map((dept, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className={`w-16 ${dept.color} rounded-t-sm`} style={{ height: `${dept.students * 0.7}px` }}></div>
          <span className="mt-2 text-sm">{dept.name}</span>
          <span className="text-sm font-medium">{dept.students} Students</span>
        </div>
      ))}
    </div>
  )
}
