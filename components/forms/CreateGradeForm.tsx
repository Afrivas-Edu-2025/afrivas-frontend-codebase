'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateGradeMutation, useGetStudentsQuery, useGetCoursesQuery, useGetClassesQuery } from '@/services/adminApi'

interface CreateGradeFormProps {
  onSuccess?: () => void
}

export default function CreateGradeForm({ onSuccess }: CreateGradeFormProps) {
  const [open, setOpen] = useState(false)
  const [createGrade, { isLoading }] = useCreateGradeMutation()

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    minScore: 0,
    maxScore: 100,
    gpa: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Grade name is required'
    if (!formData.code.trim()) newErrors.code = 'Grade code is required'
    if (formData.minScore < 0 || formData.minScore >= formData.maxScore) {
      newErrors.minScore = 'Min score must be less than max score and not negative'
    }
    if (formData.maxScore <= formData.minScore || formData.maxScore > 100) {
      newErrors.maxScore = 'Max score must be greater than min score and not exceed 100'
    }
    if (formData.gpa < 0 || formData.gpa > 4) {
      newErrors.gpa = 'GPA must be between 0 and 4'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await createGrade(formData).unwrap()
      
      toast.success('Grade created successfully!')
      setOpen(false)
      setFormData({
        name: '',
        code: '',
        description: '',
        minScore: 0,
        maxScore: 100,
        gpa: 0,
      })
      setErrors({})
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating grade:', error)
      toast.error(error?.data?.message || 'Failed to create grade')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Grade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Grade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Grade Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter grade name (e.g., A, B+, etc.)"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="code">Grade Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter grade code"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter grade description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minScore">Minimum Score</Label>
              <Input
                id="minScore"
                type="number"
                min="0"
                max="99"
                value={formData.minScore}
                onChange={(e) => handleInputChange('minScore', parseInt(e.target.value))}
                className={errors.minScore ? 'border-red-500' : ''}
              />
              {errors.minScore && <p className="text-red-500 text-sm mt-1">{errors.minScore}</p>}
            </div>
            <div>
              <Label htmlFor="maxScore">Maximum Score</Label>
              <Input
                id="maxScore"
                type="number"
                min="1"
                max="100"
                value={formData.maxScore}
                onChange={(e) => handleInputChange('maxScore', parseInt(e.target.value))}
                className={errors.maxScore ? 'border-red-500' : ''}
              />
              {errors.maxScore && <p className="text-red-500 text-sm mt-1">{errors.maxScore}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="gpa">GPA Point</Label>
            <Input
              id="gpa"
              type="number"
              min="0"
              max="4"
              step="0.1"
              value={formData.gpa}
              onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value))}
              className={errors.gpa ? 'border-red-500' : ''}
            />
            {errors.gpa && <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Grade'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
