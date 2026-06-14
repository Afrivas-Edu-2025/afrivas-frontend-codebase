'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2, BookOpen, Layers, ShieldCheck, Cpu, Zap, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateCourseMutation, useGetDepartmentsQuery, useGetLecturersQuery } from '@/services/adminApi'
import { cn } from "@/lib/utils"

interface CreateCourseFormProps {
  onSuccess?: () => void
}

export default function CreateCourseForm({ onSuccess }: CreateCourseFormProps) {
  const [open, setOpen] = useState(false)
  const [createCourse, { isLoading }] = useCreateCourseMutation()
  const { data: departmentsData } = useGetDepartmentsQuery()
  const { data: lecturersData } = useGetLecturersQuery({})

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: 3,
    level: '',
    semester: '',
    departmentId: '',
    lecturerId: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Course identity is mandatory'
    if (!formData.code.trim()) newErrors.code = 'Institutional code is mandatory'
    if (!formData.level) newErrors.level = 'Structural level is mandatory'
    if (!formData.semester) newErrors.semester = 'Temporal semester is mandatory'
    if (!formData.departmentId) newErrors.departmentId = 'Sector assignment is mandatory'
    if (formData.credits < 1 || formData.credits > 6) newErrors.credits = 'Credit mass must be between 1 and 6'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await createCourse(formData).unwrap()

      toast.success('Curriculum node initialized successfully!')
      setOpen(false)
      setFormData({
        name: '',
        code: '',
        description: '',
        credits: 3,
        level: '',
        semester: '',
        departmentId: '',
        lecturerId: '',
      })
      setErrors({})
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating course:', error)
      toast.error(error?.data?.message || 'Initialization protocol failed')
    }
  }

  const departments = departmentsData?.data || []
  const lecturers = lecturersData?.data || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="premium" className="rounded-2xl px-6 h-12 shadow-neon-primary group">
          <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
          Initialize Node
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl border-white/20 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary-100/10 to-indigo-500/10 p-8 border-b border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <Cpu size={140} className="text-primary-100" />
          </div>
          <DialogHeader>
            <div className="inline-flex items-center px-4 py-1.5 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20 text-[10px] font-bold text-primary-100 tracking-tight w-fit">
              <Layers className="w-3 h-3 mr-2" />
              Curriculum Ingress
            </div>
            <DialogTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic">
              Initialize New Node
            </DialogTitle>
            <DialogDescription className="text-xs font-bold text-muted-foreground opacity-70 mt-1 italic leading-relaxed">
              Register a new academic curriculum entity into the institutional matrix.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-100/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold px-1 text-muted-foreground italic">Institutional Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Advanced Neural Logic"
                className={cn(
                  "h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-primary-100/50",
                  errors.name ? 'border-rose-500 ring-rose-500/20' : ''
                )}
              />
              {errors.name && <p className="text-[10px] font-bold text-rose-500 mt-1 px-1 italic">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code" className="text-xs font-bold px-1 text-muted-foreground italic">Registry Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="CS-401"
                className={cn(
                  "h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-primary-100/50 uppercase",
                  errors.code ? 'border-rose-500 ring-rose-500/20' : ''
                )}
              />
              {errors.code && <p className="text-[10px] font-bold text-rose-500 mt-1 px-1 italic">{errors.code}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold px-1 text-muted-foreground italic">Heuristic Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Outline the pedagogical objectives and node scope..."
              rows={4}
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-3xl text-sm font-bold transition-all focus:ring-2 focus:ring-primary-100/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="credits" className="text-xs font-bold px-1 text-muted-foreground italic">Credit Weighting</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => handleInputChange('credits', parseInt(e.target.value))}
                className={cn(
                  "h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-100/50",
                  errors.credits ? 'border-rose-500 ring-rose-500/20' : ''
                )}
              />
              {errors.credits && <p className="text-[10px] font-bold text-rose-500 mt-1 px-1 italic">{errors.credits}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="level" className="text-xs font-bold px-1 text-muted-foreground italic">Structural Level</Label>
              <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                <SelectTrigger className={cn(
                  "h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold focus:ring-primary-100 transition-all",
                  errors.level ? 'border-rose-500' : ''
                )}>
                  <SelectValue placeholder="Identify Level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 rounded-2xl">
                  {['100', '200', '300', '400', '500'].map(lvl => (
                    <SelectItem key={lvl} value={lvl} className="text-xs font-bold p-3 focus:bg-primary-100/20">{lvl} Level</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.level && <p className="text-[10px] font-bold text-rose-500 mt-1 px-1 italic">{errors.level}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="semester" className="text-xs font-bold px-1 text-muted-foreground italic">Temporal Semester</Label>
              <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                <SelectTrigger className={cn(
                  "h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold transition-all",
                  errors.semester ? 'border-rose-500' : ''
                )}>
                  <SelectValue placeholder="Identify Semester" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 rounded-2xl">
                  <SelectItem value="1" className="text-xs font-bold p-3 focus:bg-primary-100/20">Primary Semester</SelectItem>
                  <SelectItem value="2" className="text-xs font-bold p-3 focus:bg-primary-100/20">Secondary Semester</SelectItem>
                </SelectContent>
              </Select>
              {errors.semester && <p className="text-[10px] font-bold text-rose-500 mt-1 px-1 italic">{errors.semester}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentId" className="text-xs font-bold px-1 text-muted-foreground italic">Institutional Sector (Department)</Label>
              <Select value={formData.departmentId} onValueChange={(value) => handleInputChange('departmentId', value)}>
                <SelectTrigger className={cn(
                  "h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold transition-all",
                  errors.departmentId ? 'border-rose-500' : ''
                )}>
                  <SelectValue placeholder="Identify Sector" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 rounded-2xl text-white">
                  {departments.map((department: any) => (
                    <SelectItem key={department.id} value={department.id} className="text-xs font-bold p-3 focus:bg-primary-100/20">
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departmentId && <p className="text-[10px] font-bold text-rose-500 mt-1 px-1 italic">{errors.departmentId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lecturerId" className="text-xs font-bold px-1 text-muted-foreground italic">Pedagogical Lead (Optional)</Label>
            <Select value={formData.lecturerId} onValueChange={(value) => handleInputChange('lecturerId', value)}>
              <SelectTrigger className="h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold transition-all">
                <SelectValue placeholder="Assign Lead" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 rounded-2xl text-white">
                {lecturers.map((lecturer: any) => (
                  <SelectItem key={lecturer.id} value={lecturer.id} className="text-xs font-bold p-3 focus:bg-primary-100/20">
                    {lecturer.firstName} {lecturer.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end items-center gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-12 rounded-2xl px-8 border-white/10 font-bold text-xs hover:bg-rose-500/10 hover:text-rose-500 transition-all">
              Abort Protocol
            </Button>
            <Button type="submit" disabled={isLoading} variant="premium" className="h-12 rounded-2xl px-10 shadow-neon-primary font-bold text-xs group/submit transition-all">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Initializing Node...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 group-hover/submit:animate-pulse" />
                  Activate Node
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
