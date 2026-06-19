'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2, BookOpen, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateCourseMutation, useGetLecturersQuery } from '@/services/adminApi'
import { cn } from "@/lib/utils"

interface CreateCourseFormProps {
  onSuccess?: () => void
}

export default function CreateCourseForm({ onSuccess }: CreateCourseFormProps) {
  const [open, setOpen] = useState(false)
  const [createCourse, { isLoading }] = useCreateCourseMutation()
  const { data: lecturersData } = useGetLecturersQuery({})

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  })
  const [selectedLecturerIds, setSelectedLecturerIds] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const lecturers = lecturersData?.data || []

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const toggleLecturer = (id: string) => {
    setSelectedLecturerIds(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Module name is required'
    if (!formData.code.trim()) newErrors.code = 'Module code is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await createCourse({
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
        lecturerIds: selectedLecturerIds,
      }).unwrap()

      toast.success('Module created successfully')
      setOpen(false)
      setFormData({ name: '', code: '', description: '' })
      setSelectedLecturerIds([])
      setErrors({})
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating module:', error)
      toast.error(error?.data?.message || 'Failed to create module')
    }
  }

  const selectedLecturers = lecturers.filter((l: any) => selectedLecturerIds.includes(l.id))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="premium" className="rounded-2xl px-6 h-12 shadow-neon-primary group">
          <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
          New Module
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-white/20 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary-100/10 to-indigo-500/10 p-8 border-b border-white/10">
          <DialogHeader>
            <div className="inline-flex items-center px-4 py-1.5 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20 text-[10px] font-bold text-primary-100 tracking-tight w-fit">
              <BookOpen className="w-3 h-3 mr-2" />
              Module
            </div>
            <DialogTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic">
              New Module
            </DialogTitle>
            <DialogDescription className="text-xs font-bold text-muted-foreground opacity-70 mt-1 leading-relaxed">
              Add a new module and assign the lecturers who will teach it.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-100/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold px-1 text-muted-foreground">Module Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Introduction to Programming"
                className={cn(
                  "h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-primary-100/50",
                  errors.name ? 'border-rose-500 ring-rose-500/20' : ''
                )}
              />
              {errors.name && <p className="text-[10px] font-bold text-rose-500 mt-1 px-1">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code" className="text-xs font-bold px-1 text-muted-foreground">Module Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="e.g. CS-101"
                className={cn(
                  "h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-primary-100/50 uppercase",
                  errors.code ? 'border-rose-500 ring-rose-500/20' : ''
                )}
              />
              {errors.code && <p className="text-[10px] font-bold text-rose-500 mt-1 px-1">{errors.code}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold px-1 text-muted-foreground">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Briefly describe the module objectives and topics covered..."
              rows={3}
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-3xl text-sm font-bold transition-all focus:ring-2 focus:ring-primary-100/50"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold px-1 text-muted-foreground">
              Assign Lecturers
              <span className="ml-2 text-muted-foreground/50 font-normal">(optional — can be assigned later)</span>
            </Label>

            {selectedLecturers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedLecturers.map((l: any) => (
                  <Badge
                    key={l.id}
                    variant="glass"
                    className="bg-primary-100/10 text-primary-100 border-primary-100/20 text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-colors"
                    onClick={() => toggleLecturer(l.id)}
                  >
                    {l.firstName} {l.lastName}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}

            <div className="max-h-44 overflow-y-auto rounded-2xl border border-white/20 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/30 divide-y divide-white/10">
              {lecturers.length === 0 ? (
                <p className="text-xs font-bold text-muted-foreground p-4 text-center opacity-50">No lecturers available</p>
              ) : (
                lecturers.map((lecturer: any) => {
                  const isSelected = selectedLecturerIds.includes(lecturer.id)
                  return (
                    <button
                      key={lecturer.id}
                      type="button"
                      onClick={() => toggleLecturer(lecturer.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 flex items-center justify-between text-sm font-bold transition-colors",
                        isSelected
                          ? "bg-primary-100/10 text-primary-100"
                          : "text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-slate-700/30"
                      )}
                    >
                      <span>{lecturer.firstName} {lecturer.lastName}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary-100 flex-shrink-0" />}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-12 rounded-2xl px-8 border-white/10 font-bold text-xs hover:bg-rose-500/10 hover:text-rose-500 transition-all">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} variant="premium" className="h-12 rounded-2xl px-10 shadow-neon-primary font-bold text-xs group/submit transition-all">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Module
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
