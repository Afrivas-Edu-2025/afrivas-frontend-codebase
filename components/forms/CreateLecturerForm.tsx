'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2, AlertCircle, CheckCircle2, X, GraduationCap } from 'lucide-react'
import { useCreateLecturerMutation, useGetDepartmentsQuery, useGetFacultiesQuery } from '@/services/adminApi'
import { cn } from "@/lib/utils"

interface CreateLecturerFormProps {
  onSuccess?: () => void
}

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  gender: '',
  dob: '',
  facultyId: '',
  departmentId: '',
  position: 'LECTURER',
}

export default function CreateLecturerForm({ onSuccess }: CreateLecturerFormProps) {
  const [open, setOpen] = useState(false)
  const [createLecturer, { isLoading }] = useCreateLecturerMutation()
  const { data: facultiesData } = useGetFacultiesQuery()
  const { data: departmentsData } = useGetDepartmentsQuery()

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdLecturer, setCreatedLecturer] = useState<{ firstName: string; lastName: string; email: string } | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    if (submitError) setSubmitError(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.dob) newErrors.dob = 'Date of birth is required'
    if (!formData.facultyId) newErrors.facultyId = 'Faculty is required'
    if (!formData.departmentId) newErrors.departmentId = 'Department is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setSubmitError(null)

    try {
      await createLecturer({
        appOrigin: window.location.origin,
        user: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.email.split('@')[0].toLowerCase(),
          email: formData.email,
          password: formData.password,
          role: 'LECTURER',
          facultyId: Number(formData.facultyId),
          deptId: Number(formData.departmentId),
        },
        userProfile: {
          gender: formData.gender.toUpperCase(),
          bio: `Lecturer profile for ${formData.firstName} ${formData.lastName}`,
          address: 'Not provided',
          city: 'Not provided',
          country: 'Not provided',
          birthDate: new Date(formData.dob).toISOString(),
          phoneNumber: 'N/A',
          nationalId: `NID-${Date.now()}`,
          passportNumber: `PASS-${Date.now()}`,
          profilePicture: 'https://via.placeholder.com/150',
        },
        lecturer: { position: formData.position },
      }).unwrap()

      setCreatedLecturer({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email })
      onSuccess?.()
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Something went wrong. Please try again.'
      setSubmitError(message)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setFormData(EMPTY_FORM)
    setErrors({})
    setSubmitError(null)
    setCreatedLecturer(null)
  }

  const filteredDepartments = (departmentsData?.data || []).filter(
    (d) => !formData.facultyId || d.facultyId === formData.facultyId
  )

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        <Button variant="premium" className="rounded-2xl px-6 h-12 shadow-neon-primary group">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Lecturer
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl border-white/20 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-100/10 to-indigo-500/10 p-8 border-b border-white/10">
          <DialogHeader>
            <div className="inline-flex items-center px-4 py-1.5 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20 text-[10px] font-bold text-primary-100 tracking-tight w-fit">
              <GraduationCap className="w-3 h-3 mr-2" />
              Lecturers
            </div>
            <DialogTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic">
              {createdLecturer ? 'Lecturer Added' : 'New Lecturer'}
            </DialogTitle>
            <DialogDescription className="text-xs font-bold text-muted-foreground opacity-70 mt-1 leading-relaxed">
              {createdLecturer ? 'The lecturer account has been created successfully.' : 'Fill in the details to create a new lecturer account.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Success state */}
        {createdLecturer ? (
          <div className="p-8 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {createdLecturer.firstName} {createdLecturer.lastName}
              </p>
              <p className="text-sm text-muted-foreground font-medium">{createdLecturer.email}</p>
              <p className="text-xs text-muted-foreground opacity-60 mt-2">
                Username: <span className="font-bold text-primary-100">{createdLecturer.email.split('@')[0].toLowerCase()}</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              The lecturer can now log in using their username and the password you set.
            </p>
            <div className="flex gap-3 w-full justify-center">
              <Button variant="outline" onClick={handleClose} className="rounded-2xl h-11 px-8 font-bold text-xs border-white/20">
                Close
              </Button>
              <Button
                variant="premium"
                onClick={() => { setCreatedLecturer(null); setFormData(EMPTY_FORM); setErrors({}); setSubmitError(null); }}
                className="rounded-2xl h-11 px-8 font-bold text-xs shadow-neon-primary"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Another
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-100/20">
            {/* Submission error banner */}
            {submitError && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-rose-500 flex-1 leading-relaxed">{submitError}</p>
                <button type="button" onClick={() => setSubmitError(null)} className="text-rose-500/60 hover:text-rose-500 transition-colors flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" error={errors.firstName}>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="e.g. James"
                  className={inputCn(errors.firstName)}
                />
              </Field>
              <Field label="Last Name" error={errors.lastName}>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="e.g. Okafor"
                  className={inputCn(errors.lastName)}
                />
              </Field>
            </div>

            {/* Email */}
            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="lecturer@university.edu"
                className={inputCn(errors.email)}
              />
            </Field>

            {/* Auto username */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold px-1 text-muted-foreground">Generated Username</Label>
              <Input
                value={formData.email ? formData.email.split('@')[0].toLowerCase() : ''}
                readOnly
                className="h-12 bg-white/20 dark:bg-slate-800/20 border-white/10 dark:border-slate-700/30 rounded-2xl text-sm font-bold text-muted-foreground cursor-not-allowed"
              />
              <p className="text-[10px] text-muted-foreground px-1 opacity-60">Auto-generated from email. Used to sign in.</p>
            </div>

            {/* Password */}
            <Field label="Password" error={errors.password}>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Min. 8 characters"
                className={inputCn(errors.password)}
              />
            </Field>

            {/* Gender + DOB */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Gender" error={errors.gender}>
                <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                  <SelectTrigger className={inputCn(errors.gender)}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 rounded-2xl text-white">
                    <SelectItem value="male" className="text-xs font-bold p-3 focus:bg-primary-100/20">Male</SelectItem>
                    <SelectItem value="female" className="text-xs font-bold p-3 focus:bg-primary-100/20">Female</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date of Birth" error={errors.dob}>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className={inputCn(errors.dob)}
                />
              </Field>
            </div>

            {/* Faculty */}
            <Field label="Faculty" error={errors.facultyId}>
              <Select value={formData.facultyId} onValueChange={(v) => { handleInputChange('facultyId', v); handleInputChange('departmentId', ''); }}>
                <SelectTrigger className={inputCn(errors.facultyId)}>
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 rounded-2xl text-white">
                  {(facultiesData?.data || []).map((f) => (
                    <SelectItem key={f.id} value={f.id} className="text-xs font-bold p-3 focus:bg-primary-100/20">{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Department */}
            <Field label="Department" error={errors.departmentId}>
              <Select value={formData.departmentId} onValueChange={(v) => handleInputChange('departmentId', v)} disabled={!formData.facultyId}>
                <SelectTrigger className={cn(inputCn(errors.departmentId), !formData.facultyId && 'opacity-50')}>
                  <SelectValue placeholder={formData.facultyId ? 'Select department' : 'Select a faculty first'} />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 rounded-2xl text-white">
                  {filteredDepartments.map((d) => (
                    <SelectItem key={d.id} value={d.id} className="text-xs font-bold p-3 focus:bg-primary-100/20">{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Position */}
            <Field label="Position" error={errors.position}>
              <Select value={formData.position} onValueChange={(v) => handleInputChange('position', v)}>
                <SelectTrigger className={inputCn(errors.position)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 rounded-2xl text-white">
                  <SelectItem value="LECTURER" className="text-xs font-bold p-3 focus:bg-primary-100/20">Lecturer</SelectItem>
                  <SelectItem value="HEAD_OF_DEPARTMENT" className="text-xs font-bold p-3 focus:bg-primary-100/20">Head of Department</SelectItem>
                  <SelectItem value="DEAN" className="text-xs font-bold p-3 focus:bg-primary-100/20">Dean</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Actions */}
            <div className="flex justify-end items-center gap-4 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} className="h-12 rounded-2xl px-8 border-white/10 font-bold text-xs hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} variant="premium" className="h-12 rounded-2xl px-10 shadow-neon-primary font-bold text-xs transition-all">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Lecturer
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold px-1 text-muted-foreground">{label}</Label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 px-1">
          <AlertCircle className="w-3 h-3 text-rose-500 flex-shrink-0" />
          <p className="text-[10px] font-bold text-rose-500">{error}</p>
        </div>
      )}
    </div>
  )
}

function inputCn(error?: string) {
  return cn(
    "h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold transition-all focus:ring-2 focus:ring-primary-100/50",
    error && "border-rose-500/70 ring-1 ring-rose-500/20"
  )
}
