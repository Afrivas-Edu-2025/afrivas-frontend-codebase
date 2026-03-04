'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Save, Settings, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/components/auth-context'
import {
  getAdminDashboardSettings,
  getDefaultAdminSettings,
  saveAdminDashboardSettings,
  type AdminDashboardSettings,
} from '@/lib/admin-dashboard-settings'
import {
  getUniversityOnboardingProfile,
  saveUniversityOnboardingProfile,
} from '@/lib/universityOnboarding'

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuth()
  const [settings, setSettings] = useState<AdminDashboardSettings>(() => getDefaultAdminSettings())
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const defaults = {
      institutionName: user?.universityName || user?.username || 'Afrivas University',
      institutionDescription: user?.motto || '',
      fromEmail: user?.email || 'noreply@afrivas.com',
    }
    const onboardingProfile = getUniversityOnboardingProfile(user?.id)
    setLogoDataUrl(onboardingProfile?.logoDataUrl || user?.universityLogoUrl)

    const stored = getAdminDashboardSettings(user?.id, defaults)
    if (stored) {
      setSettings(stored)
      return
    }

    setSettings(getDefaultAdminSettings(defaults))
  }, [user?.id, user?.email, user?.motto, user?.universityName, user?.username])

  const updateField = <K extends keyof AdminDashboardSettings>(key: K, value: AdminDashboardSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleLogoFileChange = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file size must be 2MB or less')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoDataUrl(reader.result)
      }
    }
    reader.onerror = () => {
      toast.error('Failed to read selected logo file')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user?.id) {
      toast.error('Unable to save settings: user session not found')
      return
    }

    if (!settings.institutionName.trim()) {
      toast.error('Institution name is required')
      return
    }

    setIsSaving(true)

    try {
      const normalized: AdminDashboardSettings = {
        ...settings,
        institutionName: settings.institutionName.trim(),
        institutionDescription: settings.institutionDescription.trim(),
        fromEmail: settings.fromEmail.trim(),
        fromName: settings.fromName.trim() || settings.institutionName.trim(),
      }

      saveAdminDashboardSettings(user.id, normalized)

      const existingProfile = getUniversityOnboardingProfile(user.id)
      saveUniversityOnboardingProfile(user.id, {
        universityName: normalized.institutionName,
        description: normalized.institutionDescription,
        logoDataUrl,
        termsAccepted: existingProfile?.termsAccepted ?? true,
        completedAt: existingProfile?.completedAt || new Date().toISOString(),
      })

      updateUser({
        universityName: normalized.institutionName,
        motto: normalized.institutionDescription,
        universityLogoUrl: logoDataUrl,
      })

      setSettings(normalized)
      toast.success('Settings saved successfully')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage institution profile and dashboard preferences.</p>
      </div>

      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Institution Profile
          </CardTitle>
          <CardDescription>These values are used across your admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution Name</Label>
              <Input
                id="institutionName"
                value={settings.institutionName}
                onChange={(event) => updateField('institutionName', event.target.value)}
                placeholder="Enter institution name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Time Zone</Label>
              <select
                id="timezone"
                value={settings.timezone}
                onChange={(event) => updateField('timezone', event.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Chicago">America/Chicago</option>
                <option value="America/Denver">America/Denver</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institutionDescription">Institution Description / Motto</Label>
            <Textarea
              id="institutionDescription"
              rows={4}
              value={settings.institutionDescription}
              onChange={(event) => updateField('institutionDescription', event.target.value)}
              placeholder="Add a short institution description"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="logo">University Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-input bg-muted/30 flex items-center justify-center">
                {logoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoDataUrl} alt="University logo preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleLogoFileChange(event.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">PNG or JPG, maximum 2MB.</p>
              </div>
              {logoDataUrl && (
                <Button type="button" variant="outline" size="icon" onClick={() => setLogoDataUrl(undefined)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Email Identity</CardTitle>
          <CardDescription>Sender details for outbound communications.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              id="fromEmail"
              type="email"
              value={settings.fromEmail}
              onChange={(event) => updateField('fromEmail', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromName">From Name</Label>
            <Input
              id="fromName"
              value={settings.fromName}
              onChange={(event) => updateField('fromName', event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Controls what appears in your dashboard notifications feed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PreferenceRow
            label="Message notifications"
            checked={settings.enableMessageNotifications}
            onCheckedChange={(checked) => updateField('enableMessageNotifications', checked)}
          />
          <PreferenceRow
            label="Calendar notifications"
            checked={settings.enableCalendarNotifications}
            onCheckedChange={(checked) => updateField('enableCalendarNotifications', checked)}
          />
          <PreferenceRow
            label="New user notifications"
            checked={settings.enableUserNotifications}
            onCheckedChange={(checked) => updateField('enableUserNotifications', checked)}
          />
          <PreferenceRow
            label="System notifications"
            checked={settings.enableSystemNotifications}
            onCheckedChange={(checked) => updateField('enableSystemNotifications', checked)}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} className="rounded-xl">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  )
}

function PreferenceRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/20 dark:border-slate-800 px-4 py-3">
      <p className="text-sm font-medium">{label}</p>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
