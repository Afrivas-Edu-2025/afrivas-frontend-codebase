'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/auth-context'
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect'
import { LiquidGlass } from '@/components/aceternity/liquid-glass'
import { FloatingElements } from '@/components/aceternity/floating-elements'
import { useUniversityOnboardingProfile, useUpdateUniversityOnboardingProfile } from '@/hooks/useUniversityOnboarding'
import ThemeToggle from '@/components/theme-toggle'

export default function UniversityOnboardingPage() {
  const router = useRouter()
  const { user, updateUser } = useAuth()

  const { data: onboardingData, isLoading: onboardingLoading } = useUniversityOnboardingProfile()
  const { mutateAsync: saveOnboarding, isPending: isSaving } = useUpdateUniversityOnboardingProfile()

  const [hydrated, setHydrated] = useState(false)
  const [step, setStep] = useState(1)
  const [universityName, setUniversityName] = useState('My University')
  const [description, setDescription] = useState('')
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined)
  const [logoFileName, setLogoFileName] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const totalSteps = 3

  useEffect(() => {
    if (hydrated) return
    if (!user) return
    if (onboardingLoading) return

    const existing = onboardingData?.profile
    setUniversityName(existing?.universityName || user?.universityName || user?.username || 'My University')
    setDescription(existing?.description || user?.motto || '')
    setLogoDataUrl(existing?.logoDataUrl || existing?.logoUrl || (user as any)?.universityLogoDataUrl || user?.universityLogoUrl)
    setTermsAccepted(existing?.termsAccepted || false)
    setHydrated(true)
  }, [hydrated, onboardingLoading, onboardingData?.profile, user])

  const handleLogoFileChange = (file: File | null) => {
    if (!file) {
      setLogoFileName(null)
      return
    }
    if (!file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) return
    setLogoFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoDataUrl(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleNext = () => {
    if (step === 1 && !universityName.trim()) return
    if (step === 2 && !description.trim()) return
    setStep((prev) => Math.min(totalSteps, prev + 1))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleFinish = () => {
    if (!user?.id || !termsAccepted) return

    void (async () => {
      const input: any = {
        universityName: universityName.trim(),
        description: description.trim(),
        termsAccepted: true,
      }
      if (logoDataUrl !== undefined) input.logoDataUrl = logoDataUrl

      const result = await saveOnboarding(input)
      const profile = result?.profile
      if (profile) {
        updateUser({
          universityName: profile.universityName,
          motto: profile.description,
          universityLogoUrl: profile.logoUrl,
          universityLogoDataUrl: profile.logoDataUrl,
          onboardingTermsAccepted: profile.termsAccepted,
          onboardingCompletedAt: profile.completedAt,
        })
      }
      router.replace('/admin/dashboard')
    })()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <LiquidGlass className="absolute inset-0">
        <FloatingElements />
      </LiquidGlass>

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-2xl relative z-20 overflow-hidden border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <CardHeader className="relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-100 via-secondary-100 to-primary-100" />
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-primary-100/10 border border-primary-100/20 w-fit">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest">
              Setup Wizard
            </span>
          </div>
          <TextGenerateEffect
            words="University Onboarding"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Step {step} of {totalSteps} — Complete onboarding to personalize your institution's profile.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-4">
          {/* Progress bar */}
          <div className="w-full bg-gray-200/50 dark:bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-100 to-secondary-100 h-full transition-all duration-500 ease-out shadow-neon-primary"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          <div className="min-h-[220px] flex flex-col justify-center animate-in slide-in-from-right-4 fade-in duration-300">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="universityName" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest text-[11px]">
                    University Name
                  </Label>
                  <Input
                    id="universityName"
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                    placeholder="Enter university name"
                    className="h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700 rounded-xl focus:ring-primary-100 focus:border-primary-100 transition-all font-medium"
                  />
                  <p className="text-[11px] text-muted-foreground italic">This name will appear across the platform and in reports.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest text-[11px]">
                    Mission & Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your university's mission or motto"
                    rows={4}
                    className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700 rounded-xl focus:ring-primary-100 focus:border-primary-100 transition-all font-medium resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest text-[11px]">
                    Institutional Logo
                  </Label>
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/30 dark:bg-slate-800/30 border-2 border-dashed border-white/40 dark:border-slate-700 flex items-center justify-center transition-all group-hover:border-primary-100/50">
                        {logoDataUrl ? (
                          <img src={logoDataUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-400 flex flex-col items-center">
                            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Button asChild variant="outline" className="cursor-pointer h-10 border-white/20 bg-white/10 dark:bg-slate-800/20 hover:bg-white/30 dark:hover:bg-slate-800/40 font-medium">
                          <label htmlFor="logo">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Choose File
                          </label>
                        </Button>
                        <span className="text-sm font-medium text-muted-foreground truncate max-w-[200px]">
                          {logoFileName ? logoFileName : "No file chosen"}
                        </span>
                      </div>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoFileChange(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <p className="text-[10px] text-muted-foreground mt-3">Recommended: Square PNG or JPG, max 2MB.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl border border-primary-100/20 bg-primary-100/5 dark:bg-primary-100/2 shadow-inner">
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    By finishing this setup, you acknowledge that you are an authorized representative of <span className="font-bold text-primary-100">{universityName}</span> and agree to the Afrivas terms of service for educational institutions.
                  </p>
                </div>
                <div className="flex items-start space-x-3 p-2 group cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(value) => setTermsAccepted(Boolean(value))}
                    className="mt-1 border-white/40 dark:border-slate-600 data-[state=checked]:bg-primary-100 data-[state=checked]:border-primary-100"
                  />
                  <Label htmlFor="terms" className="text-sm font-medium leading-relaxed group-hover:text-primary-100 transition-colors cursor-pointer">
                    I confirm that I am an authorized admin and I agree to the platform's terms and privacy policies.
                  </Label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="rounded-xl border-white/20 bg-white/20 dark:bg-slate-800/20 hover:bg-white/40 dark:hover:bg-slate-800/40 font-bold px-8 h-12"
            >
              Previous
            </Button>
            {step < totalSteps ? (
              <Button
                variant="premium"
                onClick={handleNext}
                className="rounded-xl px-10 h-12 font-bold"
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="premium"
                onClick={handleFinish}
                disabled={!termsAccepted || isSaving}
                className="rounded-xl px-10 h-12 font-bold"
              >
                {isSaving ? 'Saving...' : 'Finish Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
