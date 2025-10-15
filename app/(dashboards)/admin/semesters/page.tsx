'use client'

import { useState } from "react"
import { Edit, Trash2, Eye, Plus, Calendar, Users, Book } from "lucide-react"
import { useGetSemestersQuery, useDeleteSemesterMutation } from '@/services/adminApi'
import { toast } from 'sonner'
import CreateSemesterForm from '@/components/forms/CreateSemesterForm'

export default function SemestersPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { data: semestersData, isLoading, error, refetch } = useGetSemestersQuery()
  const [deleteSemester] = useDeleteSemesterMutation()

  const handleDeleteSemester = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete semester "${name}"? This action cannot be undone.`)) {
      try {
        await deleteSemester(id).unwrap()
        toast.success('Semester deleted successfully')
        refetch()
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete semester')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading semesters...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading semesters. Please try again.</div>
      </div>
    )
  }

  const semesters = semestersData?.data || []
  const activeSemester = semesters.find(s => s.isActive)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Semester Management</h1>
          <p className="text-gray-500">Manage academic semesters and their schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => refetch()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-600"
          >
            <Calendar className="w-4 h-4" />
            Refresh Data
          </button>
          <CreateSemesterForm onSuccess={() => refetch()} />
        </div>
      </div>

      {/* Semester Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Total Semesters</h3>
          <p className="text-3xl font-bold text-blue-600">{semesters.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Active Semester</h3>
          <p className="text-lg font-bold text-green-600">{activeSemester?.name || 'None'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Academic Year</h3>
          <p className="text-lg font-bold text-purple-600">{activeSemester?.academicYear || 'N/A'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
          <p className="text-lg font-bold text-orange-600">
            {semesters.filter(s => new Date(s.startDate) > new Date()).length}
          </p>
        </div>
      </div>

      {/* Current Semester Highlight */}
      {activeSemester && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900">{activeSemester.name}</h3>
              <p className="text-blue-700">{activeSemester.academicYear} • Currently Active</p>
              <p className="text-sm text-blue-600 mt-1">
                {new Date(activeSemester.startDate).toLocaleDateString()} - {new Date(activeSemester.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Semester List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">All Semesters</h2>
          {semesters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No semesters found. Create your first semester to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Code</th>
                    <th className="text-left py-3 px-4 font-medium">Academic Year</th>
                    <th className="text-left py-3 px-4 font-medium">Start Date</th>
                    <th className="text-left py-3 px-4 font-medium">End Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {semesters.map((semester) => (
                    <tr key={semester.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{semester.name}</td>
                      <td className="py-3 px-4 text-gray-600">{semester.code}</td>
                      <td className="py-3 px-4 text-gray-600">{semester.academicYear}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(semester.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(semester.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          semester.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {semester.isActive ? 'Active' : 'Inactive'}
                        </span>
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
                            title="Edit Semester"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSemester(semester.id, semester.name)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete Semester"
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

      {/* Semester Calendar View */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Semester Timeline</h2>
          <div className="space-y-4">
            {semesters.map((semester) => {
              const startDate = new Date(semester.startDate)
              const endDate = new Date(semester.endDate)
              const now = new Date()
              const isCurrentlyActive = now >= startDate && now <= endDate
              
              return (
                <div key={semester.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className={`w-4 h-4 rounded-full ${
                    isCurrentlyActive ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <h3 className="font-medium">{semester.name}</h3>
                    <p className="text-sm text-gray-600">
                      {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{semester.academicYear}</p>
                    <p className="text-xs text-gray-500">{semester.code}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
