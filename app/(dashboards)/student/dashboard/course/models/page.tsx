'use client'

import {
  BookOpen,
  Download,
  Eye,
  Star,
  Filter,
  Search,
  Sparkles,
  Layers,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  FileText,
  Clock,
  Zap,
  Cpu,
  Bookmark
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function ModelsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 border border-primary-100/20 text-[10px] font-black text-primary-100 uppercase tracking-[0.2em]">
            <Layers className="w-3.5 h-3.5 mr-1.5" />
            Curriculum Architecture
          </div>
          <TextGenerateEffect
            words="Pedagogical Models"
            className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium max-w-2xl">
            Audit high-fidelity course syllabi, structural frameworks, and institutional learning paradigms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] h-12 px-6">
            Syllabus Archive
          </Button>
          <Button variant="premium" className="rounded-2xl px-6 h-12 shadow-neon-primary group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Structural Insight
          </Button>
        </div>
      </div>

      {/* Roster Filtration */}
      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[280px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="QUERY STRUCTURAL MODELS..."
                  className="pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border-white/10 dark:border-slate-700/50 rounded-2xl focus:ring-primary-100 text-xs font-black uppercase tracking-widest"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select className="px-4 py-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-primary-100/50 transition-all outline-none h-12 min-w-[180px] appearance-none cursor-pointer">
                <option>All Curriculum Nodes</option>
                <option>Mathematics</option>
                <option>Computing Hub</option>
              </select>

              <Button variant="outline" className="rounded-2xl border-white/20 dark:border-slate-700/50 hover:bg-primary-100/10 font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8">
                <Filter className="h-4 w-4 mr-2" />
                Initialize Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Models Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary-100 italic">Active Blueprints</h2>
          <Badge variant="glass" className="font-black text-[9px] bg-primary-100/10 text-primary-100 border-primary-100/20 px-3 uppercase tracking-widest">Structural Assets</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>

      {/* Featured Models */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary-100 italic">Institutional Primaries</h2>
            <Badge variant="glass" className="font-black text-[9px] bg-indigo-500/10 text-indigo-500 border-indigo-500/20 px-3 uppercase tracking-widest">Critical Matrix</Badge>
          </div>
          <Button variant="ghost" className="rounded-xl h-10 font-black uppercase text-[10px] tracking-widest text-primary-100 hover:bg-primary-100/10">
            Global Registry
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <Card className="border-white/10 dark:border-slate-800 bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
          <div className="divide-y divide-white/5">
            {featuredModels.map((model) => (
              <div key={model.id} className="p-8 hover:bg-white/10 transition-all group flex flex-col lg:flex-row items-center gap-8 relative">
                <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 shadow-2xl border border-white/20", model.bgColor.replace('bg-', 'bg-').replace('-500', '-500/20'))}>
                  <BookOpen className={cn("h-8 w-8", model.bgColor.replace('bg-', 'text-'))} />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black tracking-tighter uppercase group-hover:text-primary-100 transition-colors leading-none">{model.title}</h3>
                      <div className="flex items-center gap-1.5 mt-2 opacity-60">
                        <Cpu className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{model.course}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-500 transition-all">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Badge variant="glass" className={cn("px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[8px] shadow-sm", model.statusColor.replace('bg-', 'bg-').replace('-100', '-500/10'))}>
                        {model.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed max-w-3xl">{model.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                    <div className="flex items-center gap-6 opacity-60">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Update: {model.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Sequence: {model.version}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                      <Button variant="outline" className="h-10 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest border-white/20 hover:bg-primary-100/10">
                        <Eye className="h-3.5 w-3.5 mr-2" />
                        Preview
                      </Button>
                      <Button variant="premium" className="h-10 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest shadow-neon-primary group/dl">
                        <Download className="h-3.5 w-3.5 mr-2 group-hover/dl:animate-bounce" />
                        Deploy PDF
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Decorative element */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-100/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/5 bg-white/5 text-center">
            <Button variant="ghost" className="rounded-xl font-black uppercase text-[10px] tracking-[0.3em] text-primary-100 hover:bg-primary-100/10">
              Expand Curricular Schema
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Promotional Card */}
      <Card className="bg-gradient-to-br from-indigo-600 to-primary-100 border-none shadow-lg shadow-primary-100/20 text-white rounded-3xl overflow-hidden relative group p-10 mb-10 text-center">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
          <Bookmark size={220} />
        </div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl font-black uppercase tracking-tighter italic">Blueprinted Excellence</h3>
          <p className="max-w-xl mx-auto text-xs font-bold uppercase tracking-widest opacity-80 leading-relaxed">System orientation confirms your curriculum path is aligned with the latest institutional models. Leverage these blueprints for peak scholastic output.</p>
          <Button className="mt-4 rounded-2xl bg-white text-primary-100 hover:bg-white/90 font-black h-12 uppercase tracking-[0.2em] text-[11px] px-10 shadow-2xl">
            Sync Personal Blueprint
          </Button>
        </div>
      </Card>
    </div>
  )
}

function ModelCard({ model }: any) {
  return (
    <Card className="group border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary-100/10 transition-all duration-500 relative flex flex-col h-full">
      <div className={cn("h-36 flex items-center justify-center transition-all duration-700 relative overflow-hidden", model.bgColor)}>
        <BookOpen className="h-16 w-16 text-white group-hover:scale-125 transition-transform duration-700 relative z-10" />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 right-4 z-20">
          <Badge variant="glass" className="bg-white/20 text-white border-white/30 backdrop-blur-md px-3 font-black text-[8px] uppercase tracking-widest">{model.type}</Badge>
        </div>
      </div>
      <CardContent className="p-8 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-black text-xl tracking-tighter uppercase leading-none group-hover:text-primary-100 transition-colors uppercase">{model.title}</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 rounded-lg hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-500">
            <Star className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1.5 mb-4 px-2 py-0.5 rounded bg-white/5 border border-white/5 w-fit">
          <span className="text-[9px] font-black text-primary-100 uppercase tracking-widest">{model.course}</span>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed mb-8 flex-1">{model.description}</p>

        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            <span>{model.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            <span>{model.size}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-11 rounded-xl font-black uppercase tracking-widest text-[9px] border-white/20 hover:bg-primary-100/10">
            <Eye className="h-3.5 w-3.5 mr-2" />
            OPEN
          </Button>
          <Button variant="premium" className="h-11 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-neon-primary">
            <Download className="h-3.5 w-3.5 mr-2" />
            FETCH
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const courseModels = [
  {
    id: 1,
    title: "CS101 Logic Schema",
    course: "Computing Hub",
    description: "Complete structural blueprint covering procedural logic, algorithmic heuristics, and data nodes.",
    type: "Full Syllabus",
    size: "2.5 MB",
    bgColor: "bg-blue-500 shadow-neon-primary",
  },
  {
    id: 2,
    title: "MATH201 Curriculum Node",
    course: "Mathematics Node",
    description: "Comprehensive curriculum guide with synchronized learning objectives and valuation metrics.",
    type: "Curriculum Map",
    size: "1.8 MB",
    bgColor: "bg-emerald-500 shadow-neon-emerald",
  },
  {
    id: 3,
    title: "PHYS101 Spatial Manual",
    course: "Physics Sector",
    description: "Integrated laboratory blueprint with physical heuristics and safety protocol nodes.",
    type: "Guide Book",
    size: "4.2 MB",
    bgColor: "bg-purple-500 shadow-lg",
  },
  {
    id: 4,
    title: "ENG201 Linguistic Outline",
    course: "Arts Wing",
    description: "Detailed course outline with critical reading matrix and evaluative schedule.",
    type: "Course Outline",
    size: "1.2 MB",
    bgColor: "bg-amber-500 shadow-md",
  },
  {
    id: 5,
    title: "HIST101 Chronicle Guide",
    course: "Historical Sector",
    description: "Chronological study node with key event matrices, timelines, and review heuristics.",
    type: "Study Guide",
    size: "3.1 MB",
    bgColor: "bg-rose-500 shadow-neon-danger",
  },
  {
    id: 6,
    title: "CHEM101 Atomic Protocol",
    course: "Science Wing",
    description: "Institutional safety manual and chemical handling heuristics for atomic nodes.",
    type: "Safety Manual",
    size: "2.8 MB",
    bgColor: "bg-indigo-500 shadow-lg",
  },
]

const featuredModels = [
  {
    id: 1,
    title: "Advanced Logic Blueprint",
    course: "Computing Hub",
    description: "Updated structural matrix for the advanced computing node including neural frameworks and async technologies.",
    status: "Latest Node",
    statusColor: "bg-emerald-100 text-emerald-800",
    lastUpdated: "May 15, 2025",
    version: "v2.1",
    bgColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "Linear Matrix Curriculum",
    course: "Mathematics Node",
    description: "Comprehensive structural curriculum covering vector spaces, matrix heuristics, and linear transformations.",
    status: "Synchronized",
    statusColor: "bg-blue-100 text-blue-800",
    lastUpdated: "May 10, 2025",
    version: "v1.5",
    bgColor: "bg-emerald-500",
  },
  {
    id: 3,
    title: "Modern Arts Hub Guide",
    course: "Linguistics Hub",
    description: "Integrated node featuring contemporary authors and critical analysis heuristics.",
    status: "High Engagement",
    statusColor: "bg-purple-100 text-purple-800",
    lastUpdated: "May 5, 2025",
    version: "v1.3",
    bgColor: "bg-amber-500",
  },
]
