'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateFacultyMutation } from '@/services/adminApi'

interface CreateFacultyFormProps {
  onSuccess?: () => void
}

export default function CreateFacultyForm({ onSuccess }: CreateFacultyFormProps) {
  const [open, setOpen] = useState(false)
  const [createFaculty, { isLoading }] = useCreateFacultyMutation()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Faculty name is required'
    if (formData.name.length < 3) newErrors.name = 'Faculty name must be at least 3 characters'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await createFaculty(formData).unwrap()
      
      toast.success('Faculty created successfully!')
      setOpen(false)
      setFormData({
        name: '',
        description: '',
      })
      setErrors({})
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating faculty:', error)
      toast.error(error?.data?.message || 'Failed to create faculty')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Faculty
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Faculty</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Faculty Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter faculty name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter faculty description"
              rows={3}
            />
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
                'Create Faculty'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
