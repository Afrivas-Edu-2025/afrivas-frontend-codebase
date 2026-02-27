'use client'

import {
  Search,
  Filter,
  FolderOpen,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Video,
  Music,
  Image,
  File,
  Sparkles,
  ArrowRight,
  Layers,
  Database,
  CloudDownload,
  Terminal,
  Cpu,
  Star
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function ResourcesPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 border border-primary-100/20 text-[10px] font-black text-primary-100 uppercase tracking-[0.2em]">
            <Database className="w-3.5 h-3.5 mr-1.5" />
            Central Knowledge Hub
          </div>
          <TextGenerateEffect
            words="Academic Repositories"
            className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium max-w-2xl">
            Synchronize with institutional lecture nodes, digital assets, and scholastic documentation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] h-12 px-6">
            Cloud Archive
          </Button>
          <Button variant="premium" className="rounded-2xl px-6 h-12 shadow-neon-primary group">
            <CloudDownload className="mr-2 h-4 w-4 group-hover:animate-bounce" />
            Fetch All Assets
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
                  placeholder="QUERY ASSET REGISTRY..."
                  className="pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border-white/10 dark:border-slate-700/50 rounded-2xl focus:ring-primary-100 text-xs font-black uppercase tracking-widest"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select className="px-4 py-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-primary-100/50 transition-all outline-none h-12 min-w-[180px] appearance-none cursor-pointer">
                <option>Filter by Sector</option>
                <option>Mathematics</option>
                <option>Computing</option>
              </select>

              <Button variant="outline" className="rounded-2xl border-white/20 dark:border-slate-700/50 hover:bg-primary-100/10 font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8">
                <Filter className="h-4 w-4 mr-2" />
                Initialize Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { title: "Lecture Nodes", count: "42 Files", icon: <BookOpen className="h-6 w-6" />, color: "text-blue-500", glow: "shadow-blue-500/10" },
          { title: "Visual Streams", count: "18 Videos", icon: <Video className="h-6 w-6" />, color: "text-purple-500", glow: "shadow-purple-500/10" },
          { title: "Audio Logs", count: "12 Files", icon: <Music className="h-6 w-6" />, color: "text-amber-500", glow: "shadow-amber-500/10" },
          { title: "Practice Matrices", count: "35 Files", icon: <FileText className="h-6 w-6" />, color: "text-emerald-500", glow: "shadow-emerald-500/10" },
        ].map((cat, idx) => (
          <Card key={idx} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative p-8">
            <div className={cn("inline-flex p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm border border-white/20 transition-transform group-hover:scale-110 group-hover:rotate-6", cat.color, cat.glow)}>
              {cat.icon}
            </div>
            <h3 className="text-lg font-black mt-6 tracking-tight uppercase leading-tight">{cat.title}</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">{cat.count}</p>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700">
              {cat.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Course Folders */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary-100 italic">Course Directories</h2>
          <Badge variant="glass" className="font-black text-[9px] bg-primary-100/10 text-primary-100 border-primary-100/20 px-3 uppercase tracking-widest">Structural Hierarchy</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseFolders.map((folder) => (
            <div key={folder.id} className="group border border-white/10 dark:border-slate-800 bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/50 dark:hover:bg-slate-800/60 transition-all duration-300 cursor-pointer relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-xl", folder.color.replace('bg-', 'bg-').replace('-100', '-500/10'))}>
                  <FolderOpen className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">{folder.name}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{folder.fileCount} Assets Detected</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                <ArrowRight className="w-8 h-8 -rotate-45" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Registry Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary-100 italic">Temporal Registry</h2>
            <Badge variant="glass" className="font-black text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 uppercase tracking-widest">Latest Ingress</Badge>
          </div>
          <Button variant="ghost" className="rounded-xl h-10 font-black uppercase text-[10px] tracking-widest text-primary-100 hover:bg-primary-100/10">
            Full Archive
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <Card className="border-white/10 dark:border-slate-800 bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Asset Identity</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Curriculum Node</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Payload Size</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Ingress Date</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-white/10 transition-all group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                          {getFileIcon(resource.type)}
                        </div>
                        <div className="ml-5">
                          <div className="text-xs font-black uppercase tracking-tight group-hover:text-primary-100 transition-colors">{resource.name}</div>
                          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">System ID: {resource.type} Node</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant="outline" className="text-[10px] font-black border-white/20 bg-white/5">{resource.course}</Badge>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black text-muted-foreground tracking-tighter">{resource.size}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{resource.uploaded}</span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-3">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary-100 hover:text-white transition-all shadow-lg">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 opacity-40 hover:opacity-100 transition-all">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Call to action card */}
      <Card className="bg-gradient-to-br from-primary-100 to-indigo-600 border-none shadow-lg shadow-primary-100/20 text-white rounded-3xl overflow-hidden relative group p-10 mb-10 text-center">
        <div className="absolute top-0 left-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
          <Cpu size={200} />
        </div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl font-black uppercase tracking-tighter italic">Neural Library Integration</h3>
          <p className="max-w-xl mx-auto text-xs font-bold uppercase tracking-widest opacity-80 leading-relaxed">System diagnostics confirm your library access is synchronized with the latest institutional assets. Access offline copies via the encrypted vault.</p>
          <Button className="mt-4 rounded-2xl bg-white text-primary-100 hover:bg-white/90 font-black h-12 uppercase tracking-[0.2em] text-[11px] px-10 shadow-2xl">
            Access Neural Vault
          </Button>
        </div>
      </Card>
    </div>
  )
}

function getFileIcon(type: string) {
  switch (type.toLowerCase()) {
    case "pdf":
      return <File className="h-5 w-5 text-rose-500" />
    case "ppt":
    case "pptx":
      return <File className="h-5 w-5 text-orange-500" />
    case "doc":
    case "docx":
      return <File className="h-5 w-5 text-blue-500" />
    case "mp4":
    case "video":
      return <Video className="h-5 w-5 text-purple-500" />
    case "mp3":
    case "audio":
      return <Music className="h-5 w-5 text-amber-500" />
    case "jpg":
    case "png":
    case "image":
      return <Image className="h-5 w-5 text-emerald-500" />
    default:
      return <FileText className="h-5 w-5 text-primary-100" />
  }
}

const recentResources = [
  {
    id: 1,
    name: "Linear Algebra Node Notes",
    course: "Mathematics",
    type: "PDF",
    size: "2.5 MB",
    uploaded: "May 10, 2025",
  },
  {
    id: 2,
    name: "Data Structures Stream",
    course: "Computing",
    type: "Video",
    size: "45 MB",
    uploaded: "May 8, 2025",
  },
  {
    id: 3,
    name: "Physics Lab Manual V.2",
    course: "Physics",
    type: "PDF",
    size: "3.2 MB",
    uploaded: "May 5, 2025",
  },
  {
    id: 4,
    name: "Linguistic Logic Nodes",
    course: "Arts Wing",
    type: "PPT",
    size: "5.7 MB",
    uploaded: "May 3, 2025",
  },
  {
    id: 5,
    name: "Algorithm Design Logic",
    course: "Computing",
    type: "DOCX",
    size: "1.8 MB",
    uploaded: "May 1, 2025",
  },
]

const courseFolders = [
  {
    id: 1,
    name: "Mathematics",
    fileCount: "15",
    color: "bg-blue-100",
  },
  {
    id: 2,
    name: "Computing Node",
    fileCount: "23",
    color: "bg-purple-100",
  },
  {
    id: 3,
    name: "Physics Sector",
    fileCount: "12",
    color: "bg-amber-100",
  },
  {
    id: 4,
    name: "Linguistics Hub",
    fileCount: "8",
    color: "bg-green-100",
  },
  {
    id: 5,
    name: "Historical Chronicle",
    fileCount: "5",
    color: "bg-red-100",
  },
  {
    id: 6,
    name: "Neural Assets",
    fileCount: "19",
    color: "bg-gray-100",
  },
]
