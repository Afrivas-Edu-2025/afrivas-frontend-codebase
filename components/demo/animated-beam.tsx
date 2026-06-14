"use client";

import React, { forwardRef, useRef } from "react";
import {
  BellRing,
  BookCopy,
  Database,
  FileCheck2,
  FolderKanban,
  GraduationCap,
  Presentation,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/effect-components/animated-beam";

const NodeAnchor = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/90 text-slate-950 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.95)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

NodeAnchor.displayName = "NodeAnchor";

function DiagramCard({
  title,
  subtitle,
  type,
  icon,
  tone,
  className,
  anchorRef,
}: {
  title: string;
  subtitle: string;
  type: string;
  icon: React.ReactNode;
  tone: string;
  className?: string;
  anchorRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      className={cn(
        "relative z-10 overflow-hidden rounded-[28px] border border-white/12 bg-white/8 p-4 text-white shadow-[0_24px_60px_-30px_rgba(2,6,23,0.95)] backdrop-blur-xl",
        className,
      )}
    >
      <div className={cn("absolute inset-0 opacity-90", tone)} />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <NodeAnchor ref={anchorRef}>{icon}</NodeAnchor>
          <span className="rounded-full border border-white/15 bg-black/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">
            {type}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-base font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-white/72">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function DataChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-cyan-200/15 bg-cyan-200/10 px-3 py-1 text-xs font-medium text-cyan-50">
      {children}
    </span>
  );
}

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const lecturerRef = useRef<HTMLDivElement>(null);
  const process1Ref = useRef<HTMLDivElement>(null);
  const datastoreRef = useRef<HTMLDivElement>(null);
  const process2Ref = useRef<HTMLDivElement>(null);
  const studentRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative mt-16 overflow-hidden rounded-[40px] border border-white/10 bg-[#06101c] px-6 py-14 md:px-10 lg:px-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(14,165,233,0.18),_transparent_22%),radial-gradient(circle_at_85%_18%,_rgba(132,204,22,0.16),_transparent_24%),radial-gradient(circle_at_50%_85%,_rgba(16,185,129,0.12),_transparent_28%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
            DFD Style System Map
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Afrivas as a live education data flow
          </h2>
          <p className="mt-4 text-base text-slate-300 md:text-lg">
            Lecturer data enters the platform, moves through validation and storage,
            and becomes student-ready content, alerts, and results.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <DataChip>Course notes</DataChip>
          <DataChip>Assignments</DataChip>
          <DataChip>Attendance</DataChip>
          <DataChip>Scores</DataChip>
          <DataChip>Notifications</DataChip>
        </div>

        <div
          ref={containerRef}
          className="relative mt-14 rounded-[32px] border border-white/10 bg-slate-950/40 p-5 backdrop-blur md:p-8"
        >
          <div className="grid gap-6 xl:grid-cols-[1.05fr_1.15fr_1.05fr]">
            <div className="space-y-5">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200/80">
                External Entity
              </div>
              <DiagramCard
                title="Lecturer"
                subtitle="Uploads lecture notes, class tasks, attendance, feedback, and grades into Afrivas."
                type="Source"
                icon={<Presentation className="h-5 w-5" />}
                tone="bg-gradient-to-br from-sky-500/22 via-blue-500/14 to-cyan-400/18"
                anchorRef={lecturerRef}
              />
              <div className="rounded-[28px] border border-sky-300/12 bg-sky-300/8 p-4 text-sm text-sky-50/85">
                <p className="font-semibold text-white">Input payloads</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <DataChip>Lecture plans</DataChip>
                  <DataChip>Assessment data</DataChip>
                  <DataChip>Course announcements</DataChip>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/80">
                Core Afrivas Processes
              </div>
              <DiagramCard
                title="P1. Capture and Validate"
                subtitle="Afrivas receives lecturer submissions, checks structure, links them to the correct course, and prepares them for release."
                type="Process"
                icon={<FileCheck2 className="h-5 w-5" />}
                tone="bg-gradient-to-br from-emerald-500/24 via-teal-500/14 to-cyan-400/14"
                anchorRef={process1Ref}
              />
              <DiagramCard
                title="D1. Academic Data Store"
                subtitle="Central storage for classes, course content, assessment records, attendance logs, and message history."
                type="Data Store"
                icon={<Database className="h-5 w-5" />}
                tone="bg-gradient-to-br from-cyan-500/22 via-sky-500/12 to-blue-500/18"
                anchorRef={datastoreRef}
              />
              <DiagramCard
                title="P2. Personalize and Deliver"
                subtitle="Afrivas converts stored data into student-facing dashboards, reminders, released results, and learning resources."
                type="Process"
                icon={<FolderKanban className="h-5 w-5" />}
                tone="bg-gradient-to-br from-lime-500/22 via-emerald-500/14 to-teal-400/14"
                anchorRef={process2Ref}
              />
            </div>

            <div className="space-y-5">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-200/80 xl:text-right">
                External Entities
              </div>
              <DiagramCard
                title="Student"
                subtitle="Receives timetables, learning materials, due-date reminders, feedback, and published scores in one place."
                type="Destination"
                icon={<GraduationCap className="h-5 w-5" />}
                tone="bg-gradient-to-br from-lime-400/22 via-yellow-300/12 to-emerald-400/16"
                className="xl:ml-auto"
                anchorRef={studentRef}
              />
              <DiagramCard
                title="Programme Analytics"
                subtitle="Departments and administrators can monitor participation, delivery patterns, and academic performance trends."
                type="Secondary Output"
                icon={<Users className="h-5 w-5" />}
                tone="bg-gradient-to-br from-fuchsia-500/18 via-violet-500/12 to-sky-400/14"
                className="xl:ml-auto"
                anchorRef={analyticsRef}
              />
              <div className="rounded-[28px] border border-lime-300/12 bg-lime-300/8 p-4 text-sm text-lime-50/85 xl:text-right">
                <p className="font-semibold text-white">Student-facing outputs</p>
                <div className="mt-3 flex flex-wrap gap-2 xl:justify-end">
                  <DataChip>Study packs</DataChip>
                  <DataChip>Released grades</DataChip>
                  <DataChip>Attendance alerts</DataChip>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-sky-300/12 bg-sky-300/8 p-4 text-sm text-slate-200">
              <div className="flex items-center gap-2 text-white">
                <BookCopy className="h-4 w-4 text-sky-300" />
                Content flow
              </div>
              <p className="mt-2 text-white/65">Notes and coursework move into Afrivas for structured release.</p>
            </div>
            <div className="rounded-2xl border border-emerald-300/12 bg-emerald-300/8 p-4 text-sm text-slate-200">
              <div className="flex items-center gap-2 text-white">
                <FileCheck2 className="h-4 w-4 text-emerald-300" />
                Validation
              </div>
              <p className="mt-2 text-white/65">Entries are cleaned, organized, and linked to the right class context.</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/12 bg-cyan-300/8 p-4 text-sm text-slate-200">
              <div className="flex items-center gap-2 text-white">
                <Database className="h-4 w-4 text-cyan-300" />
                Persistence
              </div>
              <p className="mt-2 text-white/65">The platform keeps a reusable academic memory for every course cycle.</p>
            </div>
            <div className="rounded-2xl border border-lime-300/12 bg-lime-300/8 p-4 text-sm text-slate-200">
              <div className="flex items-center gap-2 text-white">
                <BellRing className="h-4 w-4 text-lime-300" />
                Delivery
              </div>
              <p className="mt-2 text-white/65">Students get the right information at the right time with context.</p>
            </div>
          </div>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={lecturerRef}
            toRef={process1Ref}
            curvature={-30}
            pathColor="#7dd3fc"
            pathWidth={3}
            pathOpacity={0.25}
            gradientStartColor="#38bdf8"
            gradientStopColor="#34d399"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={process1Ref}
            toRef={datastoreRef}
            curvature={0}
            pathColor="#6ee7b7"
            pathWidth={3}
            pathOpacity={0.25}
            gradientStartColor="#34d399"
            gradientStopColor="#22d3ee"
            delay={0.5}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={datastoreRef}
            toRef={process2Ref}
            curvature={0}
            pathColor="#67e8f9"
            pathWidth={3}
            pathOpacity={0.25}
            gradientStartColor="#22d3ee"
            gradientStopColor="#a3e635"
            delay={0.8}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={process2Ref}
            toRef={studentRef}
            curvature={-24}
            pathColor="#bef264"
            pathWidth={3}
            pathOpacity={0.25}
            gradientStartColor="#84cc16"
            gradientStopColor="#fde047"
            delay={1.1}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={datastoreRef}
            toRef={analyticsRef}
            curvature={44}
            pathColor="#c084fc"
            pathWidth={3}
            pathOpacity={0.22}
            gradientStartColor="#38bdf8"
            gradientStopColor="#c084fc"
            delay={1.4}
          />
        </div>
      </div>
    </section>
  );
}
