'use client'

import {
  User,
  Bell,
  Lock,
  Globe,
  Palette,
  Save,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Star,
  Sparkles,
  ArrowRight,
  Camera,
  Layers,
  Settings
} from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SecurityDevicesPanel } from "@/components/security/security-devices-panel"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function StudentSettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [activeSegment, setActiveSegment] = useState("Profile")

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Settings className="w-3 h-3" />
              Account Management
            </span>
          </div>
          <TextGenerateEffect
            words="System Configurations"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Calibrate your academic environment and security protocols</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">
            Discard Changes
          </Button>
          <Button variant="premium" className="rounded-xl px-6 py-5 shadow-neon-primary group">
            <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Commit Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b border-white/10">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Calibration Nodes</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <nav className="space-y-1">
                <SettingsNavItem
                  icon={<User size={16} />}
                  label="Profile"
                  active={activeSegment === "Profile"}
                  onClick={() => setActiveSegment("Profile")}
                />
                <SettingsNavItem
                  icon={<Bell size={16} />}
                  label="Notifications"
                  active={activeSegment === "Notifications"}
                  onClick={() => setActiveSegment("Notifications")}
                />
                <SettingsNavItem
                  icon={<Lock size={16} />}
                  label="Security"
                  active={activeSegment === "Security"}
                  onClick={() => setActiveSegment("Security")}
                />
                <SettingsNavItem
                  icon={<Globe size={16} />}
                  label="Preferences"
                  active={activeSegment === "Preferences"}
                  onClick={() => setActiveSegment("Preferences")}
                />
                <SettingsNavItem
                  icon={<Palette size={16} />}
                  label="Appearance"
                  active={activeSegment === "Appearance"}
                  onClick={() => setActiveSegment("Appearance")}
                />
              </nav>
            </CardContent>
          </Card>

          {/* Quick Stats Support Card */}
          <Card className="bg-gradient-to-br from-primary-100 to-indigo-600 border-none shadow-lg shadow-primary-100/20 text-white rounded-3xl overflow-hidden relative group p-6">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Shield size={100} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">Security Pulse</h4>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Star className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="text-xl font-black italic">OPTIMAL</div>
                <div className="text-[8px] font-bold uppercase tracking-widest opacity-70">Identity Verified</div>
              </div>
            </div>
            <Button variant="ghost" className="w-full bg-white/10 hover:bg-white/20 text-white font-black uppercase text-[9px] tracking-widest rounded-xl">
              Audit logs
            </Button>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Section: Profile Information */}
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/10">
              <div className="flex items-center gap-3 mb-1">
                <User className="w-5 h-5 text-primary-100" />
                <CardTitle className="text-xl font-black uppercase tracking-[0.2em] text-primary-100">Identity Profile</CardTitle>
              </div>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Manage your institutional identity markers and contact protocols</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-100/20 to-indigo-500/20 flex items-center justify-center border-2 border-dashed border-primary-100/30 overflow-hidden relative">
                    <User className="h-12 w-12 text-primary-100" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <Camera className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <Badge variant="glass" className="absolute -bottom-2 -right-2 bg-emerald-500/10 text-emerald-500 font-black text-[8px] uppercase tracking-widest border-emerald-500/20 px-2 shadow-neon-emerald">Verified</Badge>
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-lg font-black uppercase tracking-tight">Institutional Avatar</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest max-w-xs">SVG, PNG or JPG (Max 2048px). Optimal aspect ratio 1:1 for scholastic identification.</p>
                  <div className="flex items-center gap-3 pt-2 justify-center md:justify-start">
                    <Button variant="premium" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-neon-primary">Upload Identity</Button>
                    <Button variant="ghost" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">Purge</Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">First Name Descriptor</label>
                  <Input
                    defaultValue="Alex"
                    className="h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-bold uppercase tracking-tight shadow-sm focus:ring-primary-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Surname Designation</label>
                  <Input
                    defaultValue="Johnson"
                    className="h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-bold uppercase tracking-tight shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Institutional ID (Static)</label>
                  <div className="h-12 flex items-center px-4 bg-primary-100/5 border border-primary-100/10 rounded-2xl text-xs font-black text-primary-100/60 uppercase tracking-widest">
                    STU2023001
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Digital Correspondence</label>
                  <Input
                    defaultValue="alex.johnson@student.university.edu"
                    className="h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-bold uppercase tracking-tight shadow-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section: Security Matrix */}
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/10">
              <div className="flex items-center gap-3 mb-1">
                <Lock className="w-5 h-5 text-indigo-500" />
                <CardTitle className="text-xl font-black uppercase tracking-[0.2em] text-indigo-500">Security Protocols</CardTitle>
              </div>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Calibrate authentication layers and credential rotations</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Current Cipher</label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      defaultValue="••••••••••••"
                      className="h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-bold pr-12"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary-100 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">New Identity Cipher</label>
                  <Input
                    type="password"
                    placeholder="ENTER COMPLEX STRING"
                    className="h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-bold uppercase tracking-tight"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Validate New Cipher</label>
                  <Input
                    type="password"
                    placeholder="RE-ENTER STRING"
                    className="h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-bold uppercase tracking-tight"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <SecuritySetting
                  icon={<Shield className="w-5 h-5 text-emerald-500" />}
                  title="Multi-Factor Authentication"
                  description="Enforce secondary validation via institutional biometric or token node"
                  defaultChecked={true}
                />
                <SecuritySetting
                  icon={<Bell className="w-5 h-5 text-amber-500" />}
                  title="Access Telemetry"
                  description="Broadcast alerts on every successful credential validation from foreign nodes"
                  defaultChecked={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section: UX Parameters */}
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/10">
              <div className="flex items-center gap-3 mb-1">
                <Layers className="w-5 h-5 text-indigo-500" />
                <CardTitle className="text-xl font-black uppercase tracking-[0.2em] text-indigo-500">UX Synchronization</CardTitle>
              </div>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Personalize environment heuristics and interface linguistics</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Linguistic Hub</label>
                  <select className="w-full h-12 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary-100 outline-none appearance-none cursor-pointer">
                    <option>English (US-International)</option>
                    <option>French (Institutional)</option>
                    <option>Spanish (Castilian)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Temporal Offset</label>
                  <select className="w-full h-12 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary-100 outline-none appearance-none cursor-pointer">
                    <option>UTC+00:00 (GMT)</option>
                    <option>UTC-05:00 (EST)</option>
                    <option>UTC+01:00 (CET)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Interface Polarity</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="ghost" className="h-12 border border-white/10 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary-100/10">Light</Button>
                    <Button variant="premium" className="h-12 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-neon-primary">Dark</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <LearningPreference
                  title="Real-time Broadcasts"
                  description="Immediate socket feedback for scholastic updates and grade logs"
                  defaultChecked={true}
                />
                <LearningPreference
                  title="Deadline Heuristics"
                  description="Predictive alerts based on milestone proximity and weighting"
                  defaultChecked={true}
                />
              </div>
            </CardContent>
          </Card>

          <SecurityDevicesPanel variant="glass" />
        </div>
      </div>
    </div>
  )
}

function SettingsNavItem({
  icon,
  label,
  active = false,
  onClick
}: {
  icon: React.ReactNode,
  label: string,
  active?: boolean,
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 group relative",
        active
          ? "bg-primary-100 text-white shadow-lg shadow-primary-100/20"
          : "text-muted-foreground hover:bg-white/10 hover:text-primary-100"
      )}
    >
      <span className={cn(
        "transition-transform duration-300",
        active ? "scale-110" : "group-hover:scale-110"
      )}>
        {icon}
      </span>
      {label}
      {active && (
        <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      )}
    </button>
  )
}

function SecuritySetting({
  icon,
  title,
  description,
  defaultChecked = false
}: {
  icon: React.ReactNode,
  title: string,
  description: string,
  defaultChecked?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 mt-0.5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-tight text-gray-800 dark:text-gray-100 mb-1">{title}</h4>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-12 h-6 bg-white/10 border border-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-100 peer-checked:shadow-neon-primary"></div>
      </label>
    </div>
  )
}

function LearningPreference({
  title,
  description,
  defaultChecked = false
}: {
  title: string,
  description: string,
  defaultChecked?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-white/10 hover:border-primary-100/30 hover:bg-primary-100/5 transition-all duration-300">
      <div>
        <h4 className="text-xs font-black uppercase tracking-tight text-gray-800 dark:text-gray-100 mb-1">{title}</h4>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-12 h-6 bg-white/10 border border-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-100 peer-checked:shadow-neon-primary"></div>
      </label>
    </div>
  )
}
