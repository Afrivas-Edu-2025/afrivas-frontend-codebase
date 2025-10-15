'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search } from 'lucide-react';
import { 
  useGetCoursesQuery, 
  useCreateCourseMutation, 
  useUpdateCourseMutation, 
  useDeleteCourseMutation,
  useToggleCourseStatusMutation 
} from '@/services/adminApi';
import { Course } from '@/types/admin';
import CreateCourseForm from '@/components/forms/CreateCourseForm';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    departmentId: '',
    semester: 'FIRST',
    creditHours: 3
  });

  const { data: coursesResponse, isLoading, error } = useGetCoursesQuery();
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [toggleCourseStatus] = useToggleCourseStatusMutation();

  const courses = coursesResponse?.data || [];
  const filteredCourses = courses?.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse.id, ...formData }).unwrap();
        setEditingCourse(null);
      } else {
        await createCourse(formData).unwrap();
      }
      
      setShowAddForm(false);
      setFormData({
        name: '',
        code: '',
        departmentId: '',
        semester: 'FIRST',
        creditHours: 3
      });
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      departmentId: course.departmentId,
      semester: course.semester,
      creditHours: course.creditHours
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id).unwrap();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await toggleCourseStatus(id).unwrap();
    } catch (error) {
      console.error('Error toggling course status:', error);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading courses...</div>;
  if (error) return <div className="text-red-500">Error loading courses</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Courses Management</h1>
        <CreateCourseForm />
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search courses by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department ID</label>
              <input
                type="text"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="FIRST">First Semester</option>
                <option value="SECOND">Second Semester</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Hours</label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.creditHours}
                onChange={(e) => setFormData({ ...formData, creditHours: +e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {editingCourse ? 'Update Course' : 'Add Course'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCourse(null);
                  setFormData({
                    name: '',
                    code: '',
                    departmentId: '',
                    semester: 'FIRST',
                    creditHours: 3
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {course.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {course.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {course.departmentId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium">
                      {course.creditHours}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {!course.approved && (
                        <button
                          onClick={() => handleApprove(course.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve Course"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Course"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Course"
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
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No courses found matching your search criteria.
        </div>
      )}
    </div>
  );
}
