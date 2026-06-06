'use client';

import { useState, useMemo } from 'react';
import { Search, FolderOpen, FileText, Download, BookOpen, File, Image, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect';
import { cn } from '@/lib/utils';
import { useGetMyNotesQuery } from '@/services/studentApi';

const FILE_ICON: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-5 h-5 text-rose-500" />,
  doc: <FileText className="w-5 h-5 text-blue-500" />,
  docx: <FileText className="w-5 h-5 text-blue-500" />,
  ppt: <File className="w-5 h-5 text-orange-500" />,
  pptx: <File className="w-5 h-5 text-orange-500" />,
  jpg: <Image className="w-5 h-5 text-emerald-500" />,
  png: <Image className="w-5 h-5 text-emerald-500" />,
  mp4: <Play className="w-5 h-5 text-purple-500" />,
};

const getFileIcon = (fileType: string) => {
  const ext = fileType.split('/').pop()?.toLowerCase() || fileType.toLowerCase();
  return FILE_ICON[ext] || <File className="w-5 h-5 text-primary-100" />;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const { data, isLoading } = useGetMyNotesQuery();
  const notes = data?.data || [];

  const modules = useMemo(() => {
    const seen = new Set<string>();
    return notes.reduce<Array<{ id: string; name: string; code: string }>>((acc, n) => {
      const key = String(n.moduleId);
      if (!seen.has(key)) {
        seen.add(key);
        acc.push({ id: key, name: n.module.moduleName, code: n.module.moduleCode });
      }
      return acc;
    }, []);
  }, [notes]);

  const filtered = useMemo(() =>
    notes.filter((n) =>
      (filterModule === 'all' || String(n.moduleId) === filterModule) &&
      n.title.toLowerCase().includes(search.toLowerCase())
    ), [notes, search, filterModule]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof notes> = {};
    filtered.forEach((n) => {
      const key = n.module.moduleName;
      if (!map[key]) map[key] = [];
      map[key].push(n);
    });
    return map;
  }, [filtered]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <FolderOpen className="w-3 h-3" /> Learning Resources
            </span>
          </div>
          <TextGenerateEffect words="Course Materials"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent" />
          <p className="text-muted-foreground font-medium mt-1">Notes, slides, and materials from your enrolled modules</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Files', value: notes.length, color: 'text-primary-100' },
          { label: 'Modules', value: modules.length, color: 'text-emerald-500' },
          { label: 'This Month', value: notes.filter((n) => new Date(n.createdAt) > new Date(Date.now() - 30 * 86400000)).length, color: 'text-amber-500' },
        ].map((s) => (
          <Card key={s.label} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className={cn('text-2xl font-black tracking-tight', s.color)}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterModule('all')}
            className={cn('px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border transition-all',
              filterModule === 'all' ? 'bg-primary-100/20 text-primary-100 border-primary-100/30' : 'text-muted-foreground border-white/10 hover:border-white/30')}>
            All Modules
          </button>
          {modules.map((m) => (
            <button key={m.id}
              onClick={() => setFilterModule(m.id)}
              className={cn('px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border transition-all',
                filterModule === m.id ? 'bg-primary-100/20 text-primary-100 border-primary-100/30' : 'text-muted-foreground border-white/10 hover:border-white/30')}>
              {m.code}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped by Module */}
      {Object.keys(grouped).length === 0 ? (
        <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
          <CardContent className="py-16 text-center opacity-40">
            <FolderOpen className="w-12 h-12 mx-auto mb-3" />
            <p className="font-bold text-sm">No materials available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([moduleName, moduleNotes]) => (
            <div key={moduleName}>
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-4 h-4 text-primary-100" />
                <h3 className="font-bold text-sm uppercase tracking-widest text-primary-100">{moduleName}</h3>
                <div className="flex-1 h-px bg-white/10" />
                <Badge variant="outline" className="text-primary-100 border-primary-100/20 text-[10px]">
                  {moduleNotes.length} files
                </Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {moduleNotes.map((note) => (
                  <Card key={note.id}
                    className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 group-hover:scale-110 transition-transform shrink-0">
                          {getFileIcon(note.fileType)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary-100 transition-colors">
                            {note.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-muted-foreground uppercase">{note.fileType.split('/').pop()}</span>
                            <span className="text-[10px] text-muted-foreground">•</span>
                            <span className="text-[10px] text-muted-foreground">{formatSize(note.fileSize)}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <a href={note.filePath} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="w-full rounded-lg text-xs gap-1.5 h-7 hover:bg-primary-100/10 hover:text-primary-100">
                            <Download className="w-3 h-3" /> Download
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
