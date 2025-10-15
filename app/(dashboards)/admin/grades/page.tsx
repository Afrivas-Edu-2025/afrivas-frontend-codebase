'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search } from 'lucide-react';
import { 
  useGetGradesQuery, 
  useCreateGradeMutation, 
  useUpdateGradeMutation, 
  useDeleteGradeMutation,
  useToggleGradeStatusMutation 
} from '@/services/adminApi';
import { Grade } from '@/types/admin';
import CreateGradeForm from '@/components/forms/CreateGradeForm';

export default function GradesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    classId: '',
    score: '',
    gradeType: 'QUIZ',
    semester: 'FIRST',
    academicYear: new Date().getFullYear().toString(),
    remarks: ''
  });

  const { data: gradesResponse, isLoading, error } = useGetGradesQuery();
  const [createGrade] = useCreateGradeMutation();
  const [updateGrade] = useUpdateGradeMutation();
  const [deleteGrade] = useDeleteGradeMutation();
  const [toggleGradeStatus] = useToggleGradeStatusMutation();

  const grades = gradesResponse?.data || [];
  const filteredGrades = grades?.filter(grade =>
    grade.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.gradeType.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gradeData = {
        ...formData,
        score: parseFloat(formData.score),
        academicYear: parseInt(formData.academicYear)
      };

      if (editingGrade) {
        await updateGrade({ id: editingGrade.id, ...gradeData }).unwrap();
        setEditingGrade(null);
      } else {
        await createGrade(gradeData).unwrap();
      }
      
      setShowAddForm(false);
      setFormData({
        studentId: '',
        courseId: '',
        classId: '',
        score: '',
        gradeType: 'QUIZ',
        semester: 'FIRST',
        academicYear: new Date().getFullYear().toString(),
        remarks: ''
      });
    } catch (error) {
      console.error('Error saving grade:', error);
    }
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setFormData({
      studentId: grade.studentId,
      courseId: grade.courseId,
      classId: grade.classId,
      score: grade.score.toString(),
      gradeType: grade.gradeType,
      semester: grade.semester,
      academicYear: grade.academicYear.toString(),
      remarks: grade.remarks || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await deleteGrade(id).unwrap();
      } catch (error) {
        console.error('Error deleting grade:', error);
      }
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await toggleGradeStatus(id).unwrap();
    } catch (error) {
      console.error('Error toggling grade status:', error);
    }
  };

  const getGradeColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading grades...</div>;
  if (error) return <div className="text-red-500">Error loading grades</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Grades Management</h1>
        <CreateGradeForm />
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search grades by student, course, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingGrade ? 'Edit Grade' : 'Add New Grade'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
              <input
                type="text"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class ID</label>
              <input
                type="text"
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Type</label>
              <select
                value={formData.gradeType}
                onChange={(e) => setFormData({ ...formData, gradeType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="QUIZ">Quiz</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="MIDTERM">Midterm</option>
                <option value="FINAL">Final</option>
                <option value="PROJECT">Project</option>
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <input
                type="number"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {editingGrade ? 'Update Grade' : 'Add Grade'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGrade(null);
                  setFormData({
                    studentId: '',
                    courseId: '',
                    classId: '',
                    score: '',
                    gradeType: 'QUIZ',
                    semester: 'FIRST',
                    academicYear: new Date().getFullYear().toString(),
                    remarks: ''
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

      {/* Grades Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
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
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {grade.student?.fullName || 'Unknown Student'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {grade.student?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {grade.course?.name || 'Unknown Course'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {grade.course?.code || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {grade.gradeType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getGradeColor(grade.score)}`}>
                      {grade.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.semester} {grade.academicYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      grade.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {grade.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {!grade.approved && (
                        <button
                          onClick={() => handleApprove(grade.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve Grade"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(grade)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Grade"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(grade.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Grade"
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

      {filteredGrades.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No grades found matching your search criteria.
        </div>
      )}
    </div>
  );
}
